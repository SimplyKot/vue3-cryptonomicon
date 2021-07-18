<?php
/**
 * Константы
 */


 class Constant {
    const VAR_REGION_CODE = 'kaluga';
    const VAR_PROJECT_API_URI = 'api.test2.oirc';
    const VAR_ROOT_DOMAIN = 'debet.test2.oirc';
    const COOKIE_DOMAIN = 'debet.test2.oirc';
    const VAR_SITE_TITLE = 'Дебиторская задолженность'; // Название проекта
    const VAR_SITE_URL = 'http://debet.test2.oirc';
    const VAR_SITE_URL_NO_HTTP = 'debet.test2.oirc';
    const DELIVERY_HOST = 'smtp.yandex.ru';
    const DELIVERY_PORT = 587;
    const DELIVERY_FROM = 'support@company42.ru';
    const DELIVERY_USER = 'support@company42.ru';
    const DELIVERY_PASS = 'ehf0zyb9#nopass';
    const VAR_USER_AUTH_PERIOD = 604800; // количество секунд в течение которых активная сессия обычного пользователя (по умолчанию 7 дней = 3600сек * 24ч * 7дн)
    const VAR_USER_REGISTRATION_AUTH_PERIOD = 3600;
    const VAR_USER_ONLINE_PERIOD = 900;
    const VAR_USER_REGISTRATION_CODE_PERIOD = 600;
    const WELCOME = "Калужская область<br>Доступное ЖКХ";
    const VAR_CACHE_PERIOD = 604800;
    const NO_DATA = '<span class="font-no-data">Нет данных</span>';
    const VAR_DEFAULT_LANG_ID = 1; // Язык по умолчанию русский
    const DEFAULT_USER_IP = '95.213.4.241';
    const UNION_TYPE_DEFAULT = 1;
    const ROLE_ADM_LANGUAGE = 1; // Роль для работы с языками
    const ROLE_ADM_HELP = 2; // Роль для работы со справочником
    const ROLE_USR_CREATE_AUCTION = 1; // Создать конкурс
    const ROLE_USR_CREATE_USER = 2; // Создать пользователя
    const ROLE_USR_AUCTION_JUDGE = 4; // Проставлять баллы по конкурсу
    const ROLE_USR_AUCTION_JUDGE_ADMIN = 8; // Закрыть конкурс
    const ROLE_USR_REQUEST_ANSWER = 16; // Ответить на запрос
    const ROLE_USR_REQUEST_CREATE = 32; // Создать запрос
    const VAR_USER_FEEDBACK_TYPE_SMS = 1;
    const VAR_USER_FEEDBACK_TYPE_EMAIL = 2;
    const VAR_USER_TYPE_ORGANIZER = 1;
    const VAR_USER_TYPE_KK = 2;
    const VAR_USER_TYPE_PLAYER = 3;
    const VAR_USER_TYPE_CHAIRMAIN = 4;
    const VAR_USER_TYPE_SECRETARY = 5;
    const VAR_USER_TYPE_KK_USER = 6;
    const DEF_ITEMS_PER_PAGE = 50;
    const NO_ID = '';
    const VALUTA_RUB = 1;
    const VALUTA_DOL = 2;
    const VALUTA_EUR = 3;
    const APP_FIELD_STRING = 1;
    const APP_FIELD_TEXT = 2;
    const APP_FIELD_NUMBER = 3;
    const APP_FIELD_DATE = 4;
    const APP_FIELD_DATETIME = 5;
    const APP_FIELD_FILE = 6;
    const VAR_HOME_EVEN = 1;
    const VAR_HOME_ODD = 2;
    const VAR_HOME_ALL = 3;
    const VAR_DEBET_SETTINGS_SUM = 1;
    const VAR_DEBET_SETTINGS_TIME = 2;
    const VAR_DEBET_SETTINGS_SUMHOME = 3;
    const VAR_DEBET_SETTINGS_TEMPLATE_STATEMENT = 1;
    const VAR_DEBET_SETTINGS_TEMPLATE_EXTRACT = 2;
    const VAR_DEBET_SETTINGS_TEMPLATE_TYPE_CLAIM = 3;
    const VAR_DEBET_SETTINGS_TEMPLATE_TYPE_CLAIM_ACT = 4;
    const VAR_DEBET_SETTINGS_TEMPLATE_TYPE_IP = 5;
    const VAR_DEBET_SETTINGS_TEMPLATE_TYPE_IP_PFR = 6;
    const VAR_DEBET_SETTINGS_TEMPLATE_STATEMENT_WRIT = 7;
    const VAR_DEBET_TIME_DAY = 1;
    const VAR_DEBET_TIME_WEEK = 2;
    const VAR_DEBET_TIME_MONTH = 3;
    const VAR_DEBET_TIME_YEAR = 4;
    const VAR_BILLING_BILL_ACCOUNT_OPERATION_TYPE_PAY = 1;
    const VAR_BILLING_BILL_ACCOUNT_OPERATION_TYPE_CALCULATION = 2;
    const VAR_BILLING_BILL_ACCOUNT_OPERATION_TYPE_RECALCULATION = 3;
    const VAR_BILLING_BILL_ACCOUNT_OPERATION_TYPE_PENI = 4;
    const VAR_BILLING_BILL_ACCOUNT_OPERATION_TYPE_PENI_TRANSFER = 5;
    #region Типа изменения дела
    const VAR_DEBET_CASE_JOURNAL_TYPE_OPEN = 1;
    const VAR_DEBET_CASE_JOURNAL_TYPE_CHANGE_STATUS = 2;
    const VAR_DEBET_CASE_JOURNAL_TYPE_CHANGE_INFO = 3;
    const VAR_DEBET_CASE_JOURNAL_TYPE_CLOSED = 4;
    const VAR_DEBET_CASE_JOURNAL_TYPE_DOC_UPLOAD = 5;
    const VAR_DEBET_CASE_JOURNAL_TYPE_DOC_DELETE = 6;
    const VAR_DEBET_CASE_JOURNAL_TYPE_CHANGE_STATUS_OWNER = 7;
    const VAR_DEBET_CASE_JOURNAL_TYPE_CHANGE_INFO_OWNER = 8;
    const VAR_DEBET_CASE_JOURNAL_TYPE_EXEC_OWNER = 9;
    #endregion region Типа изменения претензии
    const VAR_DEBET_CLAIM_JOURNAL_TYPE_OPEN = 1;
    const VAR_DEBET_CLAIM_JOURNAL_TYPE_CHANGE_STATUS = 2;
    const VAR_DEBET_CLAIM_JOURNAL_TYPE_CHANGE_INFO = 3;
    const VAR_DEBET_CLAIM_JOURNAL_TYPE_CASE_OPEN = 4;
    const VAR_DEBET_CLAIM_JOURNAL_TYPE_DOC_UPLOAD = 5;
    const VAR_DEBET_CLAIM_JOURNAL_TYPE_DOC_DELETE = 6;
    #endregion region Типа изменения дела
    const VAR_DEBET_EXEC_JOURNAL_TYPE_OPEN = 1;
    const VAR_DEBET_EXEC_JOURNAL_TYPE_CHANGE_STATUS = 2;
    const VAR_DEBET_EXEC_JOURNAL_TYPE_CHANGE_INFO = 3;
    const VAR_DEBET_EXEC_CLOSED = 4;
    const VAR_DEBET_EXEC_JOURNAL_TYPE_DOC_UPLOAD = 5;
    const VAR_DEBET_EXEC_JOURNAL_TYPE_DOC_DELETE = 6;
    #endregion region Статус судебного дела
    const VAR_DEBET_CASE_STATUS_CREATED = 1;
    const VAR_DEBET_CASE_STATUS_COURT = 2;
    const VAR_DEBET_CASE_STATUS_COURT_HEARING = 3;
    const VAR_DEBET_CASE_STATUS_JURISDICTION = 4;
    const VAR_DEBET_CASE_STATUS_COURT_ACT = 5;
    const VAR_DEBET_CASE_STATUS_CLOSED = 6;
    #endregion region Статус судебного дела по собственнику
    const VAR_DEBET_CASE_OWNER_STATUS_COURT_ACT = 1;
    const VAR_DEBET_CASE_OWNER_STATUS_COURT_ACT_APPEAL = 2;
    const VAR_DEBET_CASE_OWNER_STATUS_COURT_EXEC = 3;
    #endregion region Статус претензии
    const VAR_DEBET_CLAIM_STATUS_CREATED = 1;
    const VAR_DEBET_CLAIM_STATUS_GOS = 2;
    #endregion region Статус исполнительного производства
    const VAR_DEBET_EXEC_STATUS_CREATED = 1;
    const VAR_DEBET_EXEC_STATUS_DOC_EXEC = 2;
    const VAR_DEBET_EXEC_STATUS_DOC_EXEC_RETURN = 3;
    const VAR_DEBET_EXEC_STATUS_IP = 4;
    const VAR_DEBET_EXEC_STATUS_IP_REQ = 5;
    const VAR_DEBET_EXEC_STATUS_IP_FINISH = 6;
    const VAR_DEBET_EXEC_STATUS_DEBT_REPAID = 7;
    #endregion
    // Статусы записей
    const STATUS_ACTIVE = 1;
    const STATUS_BLOCKED = 2;
    const STATUS_DELETED = 4;
    const STATUS_HIDDEN = 8;
    const STATUS_TEST = 16;
    const STATUS_PRIVATE = 32;
    const STATUS_DUPLICATE = 64;
    const STATUS_MODERATED = 128;
    // Операции по Л/С
    const ACCOUNT_OPERATION_TYPE_PAID_ID = 1; // Оплата
    const ACCOUNT_OPERATION_TYPE_CREDIT_ID = 2; // Начисление
    const ACCOUNT_OPERATION_TYPE_RECALC_ID = 3; // Перерасчёт
    const ACCOUNT_OPERATION_TYPE_PENI_ID = 4; // Начисление пени
    const LIMIT_ACCOUNT_COUNT = 50000; // количество ЛС в методе Model_Billing::getExpense()
    // Etc
    const VAR_DEBET_CLAIM_REPORT_PERIOD_TYPE_YEAR = 1;
    const VAR_DEBET_CLAIM_REPORT_PERIOD_TYPE_MONTH = 2;
    const VAR_DEBET_CLAIM_REPORT_LOCALITY_TYPE_ALL = 1;
    const VAR_DEBET_CLAIM_REPORT_LOCALITY_TYPE_DIS = 2;
    const VAR_DEBET_CLAIM_REPORT_LOCALITY_TYPE_CIT = 3;
    const VAR_DEBET_CLAIM_REPORT_LOCALITY_TYPE_LOC = 4;
    const VAR_DEBET_CLAIM_REPORT_LOCALITY_TYPE_STR = 5;
    const VAR_DEBET_CLAIM_REPORT_LOCALITY_TYPE_HOS = 6;
    const VAR_DEBET_CLAIM_REPORT_FKR_SS = 0;
    const VAR_DEBET_CLAIM_REPORT_FKR_RO = 1;
    const VAR_DEBET_CLAIM_REPORT_FKR_ALL = 2;
    const VAR_DEBET_CLAIM_REPORT_FKR_APART = 3;
    const VAR_DEBET_CLAIM_REPORT_OWNER_TYPE_FIZ = 0;
    const VAR_DEBET_CLAIM_REPORT_OWNER_TYPE_YUR = 1;
    const VAR_DEBET_CLAIM_REPORT_OWNER_TYPE_ALL = 2;
    const VAR_DEBET_CLAIM_REPORT_OWNER_TYPE_APART = 3;
    const VAR_DEBET_FILE_TYPE_CLAIM = 1;
    const VAR_DEBET_FILE_TYPE_CASE_STATEMENT = 2;
    const VAR_DEBET_FILE_TYPE_CASE_EXTRACT = 3;
    const VAR_DEBET_FILE_TYPE_CASE_OWNER = 4;
    const VAR_DEBET_FILE_TYPE_EXEC = 5;
    const VAR_DEBET_FILE_TYPE_OTHER = 6;
    const VAR_DEBET_FILE_TYPE_EXEC_PFR = 7;
    const VAR_DEBET_FILE_TYPE_CASE_STATEMENT_WRIT = 8;
    // Billing
    // Системные постоянные услуги
    const BILLING_BILL_SERVICE_MIN_ID = 1; // Идентификатор услуги по минимальному взносу
    const BILLING_BILL_SERVICE_DOP_ID = 2; // Идентификатор услуги по дополнительному взносу
    const BILLING_BILL_SERVICE_SPEC_ID = 100; // Печать квитанции
    const BILLING_BILL_SERVICE_PENI = 10000; // Пеня (нет в БД)
    const BILLING_BILL_SERVICE_DOP_PENI = 123123; // Пеня (нет в БД)
    const BILLING_BILL_SERVICE_SPEC_PENI = 123123; // Пеня (нет в БД)
    #region File ext
    const FILE_EXT_PDF = 1;
    const FILE_EXT_XLSX = 2;
    const FILE_EXT_XLS = 3;
    const FILE_EXT_DOCX = 4;
    const FILE_EXT_DOC = 5;
    const FILE_EXT_PNG = 6;
    const FILE_EXT_JPEG = 7;
    const FILE_EXT_JPG = 8;
    const FILE_EXT_TEXT = 9;
    #endregion region Other
    const VAR_DEFAULT_LEGAL_PERSON_COURT = 1;
    #endregion
}

