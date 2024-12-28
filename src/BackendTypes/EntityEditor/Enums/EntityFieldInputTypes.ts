export enum EntityFieldInputTypes {
    NUMBER = 'NUMBER', //TODO for legacy compatibility, remove after upgrade
    INTEGER = 'INTEGER',
    DECIMAL = 'DECIMAL',
    PASSWORD = 'PASSWORD',
    TEXT = 'TEXT',
    TIME = 'TIME',
    DATE = 'DATE',
    DATETIME = 'DATETIME',
    EMAIL = 'EMAIL',
    CHECKBOX = 'CHECKBOX',
    SELECT = 'SELECT', //comes from Enums
    MULTIPLE_SELECT = 'MULTIPLE_SELECT',
    SINGLE_SELECT = 'SINGLE_SELECT',
    DEFAULT = 'DEFAULT'
}
