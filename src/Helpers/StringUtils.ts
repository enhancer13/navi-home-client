import {camelCase, snakeCase, startCase} from "lodash";

export const snakeToPascal = (value: string): string => {
    return startCase(camelCase(snakeCase(value)));
}

export const splitPascalCase = (value: string): string => {
    return value.replace(/([A-Z])/g, ' $1').trim()
}

export const pascalToCamel = (value: string): string => {
    const camel = camelCase(value);
    return camel.charAt(0).toLowerCase() + camel.slice(1);
}

export const toCapitalized = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
