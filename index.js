#!/usr/bin/env node

/*
 * Copyright (c) 2017 Federico Vitale - @Rawnly <fedevitale99@gmail.com> (rawnly.com)
 *
 * =============
 * Rawgit Client
 * =============
 *
*/

const Meow = require('meow');
const got = require('got');
const url = require('tinyurl');
const chalk = require('chalk');
const boxen = require('boxen');

const { getInfos } = require('./utils');

const boxstyle =  {
  padding: 2,
  color: 'yellow'
}

const cli = new Meow(chalk`
    Usage: rawgit <url> [flags]

    {yellow --dev}           {dim Output the development url.}
    {yellow --build}         {dim Output the build url.}
    {yellow --short}         {dim Output the url shorten by tinyurl.}

    {yellow -h --help}       {dim Output this message.}
    {yellow -v --version}    {dim Output the CLI version.}
    {yellow -i --info}       {dim Output developer's infos.}
  `, {
  alias: {
    h: 'help',
    v: 'version',
    i: 'info'
  }
});


function client(action, flags) {
  if (!flags.help && !flags.info && !flags.version) {
    if (action.length > 0 && action[0] !== undefined) {
      const cID = '9f45883b8cf779f4c8ec';
      const cSE = 'd94a6f256dc080765f6ceda57cebfb641864f1f1';
      let info = getInfos(action[0]);

      got(`https://api.github.com/repos/${info.user}/${info.repo}/commits?client_id=${cID}&client_secret=${cSE}`).then(({body}) => {
        body = JSON.parse(body);
        info.commit = body[0].sha.slice(0, 7);

        let templateURL = ``;

        if (!flags.dev || flags.build) {
          templateURL = `https://cdn.rawgit.com/${info.user}/${info.repo}/${info.commit}/${info.path}`;
        } else {
          templateURL = `https://rawgit.com/${info.user}/${info.repo}/${info.branch}/${info.path}`
        }


        console.log('');

        if (flags.short) {
          url.shorten(templateURL, function(url) {
            console.log(boxen(chalk`{green ${flags.dev ? chalk`{cyan [DEV]} ` : ''}SHORTEN URL:} ${url}`, boxstyle));
          });
        } else if (!flags.short) {
          console.log(chalk`{green URL:} ${templateURL}`);
        }

      }).catch(e => {
        throw new Error(e);
      })
    }
  } else {
    if (flags.info || flags.i) {
      const box = boxen(`Developer: @Rawnly\nGithub:    https://github.com/Rawnly\nURL:       https://rawnly.com`, boxstyle);
      console.log(box);
    }
  }
}


client(cli.input, cli.flags);
