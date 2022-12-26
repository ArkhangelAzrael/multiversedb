MultiverseDB
=======

### TODO

 - Remove agenda
 - Remove factions from deckbuilding
 - Remove OCTGN
 - Remove throneDB references
 - Remove tests?
 - Remove commands?

# Very quick guide on how to install a local copy

This guide assumes you know how to use the command-line and that your machine has php and mysql installed.

- install composer: https://getcomposer.org/download/
- clone the repo somewhere
- cd to it
- run `composer install` (at the end it will ask for the database configuration parameters)
- run `php bin/console doctrine:database:create`
- run `php bin/console doctrine:schema:create`
- run `php bin/console app:import:std ../multiversedb-json-data` or whatever the path to your MultiverseDB JSON data repository is
- run `php bin/console app:import:trans ../multiversedb-json-data` if you want to import the translations
- run `php bin/console server:run`

## Setup an admin account

- register (or run `php bin/console fos:user:create <username>`)
- make sure your account is enabled (or run `php bin/console fos:user:activate <username>`)
- run `php bin/console fos:user:promote --super <username>`
