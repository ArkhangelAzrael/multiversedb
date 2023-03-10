/* global moment, Translator, app */

(function app_user(user, $)
{

    user.params = {};

    /**
     * Deferred Object. The handlers are defined at the end of the module, once the functions are declared
     * resolve: the User is logged in (authenticated session)
     * reject: the User is not logged in (anonymous session)
     */
    user.loaded = $.Deferred();

    /**
     * @memberOf user
     */
    user.query = function query()
    {
        $.ajax(Routing.generate('user_info', user.params), {
            cache: false,
            dataType: 'json',
            success: function (data, textStatus, jqXHR)
            {
                user.data = data;
                if(user.data) {
                    user.loaded.resolve();
                } else {
                    user.loaded.reject();
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] Error on ' + this.url, textStatus, errorThrown);
                user.loaded.reject();
            }
        });
    };

    /**
     * @memberOf user
     */
    user.retrieve = function retrieve()
    {
        if(localStorage) {
            var timestamp = new Date(parseInt(localStorage.getItem('user_timestamp'), 10));
            var now = new Date();
            if(now - timestamp < 3600000) {
                var storedData = localStorage.getItem('user');
                if(storedData) {
                    user.data = JSON.parse(storedData);
                    if(user.data) {
                        user.loaded.resolve();
                    } else {
                        user.loaded.reject();
                    }
                    return;
                }
            }
        }
        user.query();
    };

    /**
     * @memberOf user
     */
    user.wipe = function wipe()
    {
        localStorage.removeItem('user');
        localStorage.removeItem('user_timestamp');
    };

    /**
     * @memberOf user
     */
    user.store = function store()
    {
        localStorage.setItem('user', JSON.stringify(user.data));
        localStorage.setItem('user_timestamp', new Date().getTime());
    };

    /**
     * @memberOf user
     */
    user.anonymous = function anonymous()
    {
        user.wipe();
        user.dropdown('<ul class="dropdown-menu"><li><a href="' + Routing.generate('fos_user_security_login') + '">' + Translator.trans('nav.user.loginregister') + '</a></li></ul>');
    };

    /**
     * @memberOf user
     */
    user.update = function update()
    {
        user.store();
        user.dropdown('<ul class="dropdown-menu"><li><a href="'
                + Routing.generate('user_profile_edit')
                + '">' + Translator.trans('nav.user.editaccount') + '</a></li><li><a href="'
                + user.data.public_profile_url
                + '">' + Translator.trans('nav.user.profile') + '</a></li><li><a href="'
                + Routing.generate('fos_user_security_logout')
                + '" onclick="app.user.wipe()">' + Translator.trans('nav.user.logout') + '</a></li></ul>');
    };

    user.dropdown = function dropdown(list)
    {
        $('#login a').append('<span class="caret"></span>').removeClass('disabled').addClass('dropdown-toggle').attr('data-toggle', 'dropdown').after(list);
    };

    /**
     * @memberOf user
     */
    user.display_ads = function display_ads()
    {
        return;
    };

    user.loaded.done(user.update).fail(user.anonymous).always(user.display_ads);

    $(function ()
    {
        if($.isEmptyObject(user.params)) {
            user.retrieve();
        } else {
            user.query();
        }
    });

})(app.user = {}, jQuery);
