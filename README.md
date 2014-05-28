# Webmaker Kit Builder
// brief intro to come

## Builder Usage

* Most of the form inputs accept markdown so that you can quickly churn out your content w/ the formatting you want.
* In the "Author(s)" field using an "@" symbol before a webmaker username will convert it into a link to that users makes.
* The header block works best w/ darker background images.

## Development
### Clone this repo recursively
When cloning this repository you need to do so recursively else things go wrong. Its simple to do so however.

	git clone https://github.com/mozilla/webmaker-kits-builder.git

### Getting Started
Make sure to have **grunt** and **bower** installed globally.

	npm install -g grunt-cli bower

Next run `npm install`, followed by `grunt` to get the development server running.

### Play nice

* remove trailing whitespace from files before save
* don't use non-ascii file names
* run `grunt build` before commit (and make sure there are no errors)

Do all this w/ ease!

	mv .git/hooks/pre-commit.sample .git/hooks/pre-commit
	echo "\n# run grunt build before commit, abort if errors\ngrunt" >> .git/hooks/pre-commit

## License
Unless otherwise stated:
This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
