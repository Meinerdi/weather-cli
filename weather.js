#!/usr/bin/env node
import { printHelp, printError, printSuccess, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js';
import { getIcon, getWeather } from './services/api.service.js';
import { getArgs } from './helpers/args.js';

const saveToken = async (token) => {
    if (!token.length) {
        printError('Token was not passed');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Token was saved');
    } catch (e) {
        printError(e.message);
    }
};

const saveCity = async (city) => {
    if (!city.length) {
        printError('City was not passed');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('City was saved');
    } catch (e) {
        printError(e.message);
    }
};

const getForecast = async () => {
    try {
        const weather = await getWeather();
        printWeather(weather, getIcon(weather.weather[0].icon));
    } catch (e) {
        if (e.response.status === 404) {
            printError('Invalid city');
        } else if (e.response.status === 401) {
            printError('Invalid token');
        } else {
            printError(e.message);
        }
    }
};

const initCLI = () => {
    const { h,s,t } = getArgs(process.argv);

    if (h) {
        return printHelp();
    }
    if (s) {
        return saveCity(args.s);
    }
    if (t) {
        return saveToken(args.t);
    }

    return getForecast();
};

initCLI();