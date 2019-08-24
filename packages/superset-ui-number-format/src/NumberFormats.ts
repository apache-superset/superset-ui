const DOLLAR = '$,.2f';
const DOLLAR_SIGNED = '+$,.2f';
const DOLLAR_ROUND = '$,d';
const DOLLAR_ROUND_SIGNED = '+$,d';

const DURATION = 'DURATION';
const DURATION_MS = 'DURATION_MS';
const DURATION_S = 'DURATION_S';

const FLOAT_1_POINT = ',.1f';
const FLOAT_2_POINT = ',.2f';
const FLOAT_3_POINT = ',.3f';
const FLOAT = FLOAT_2_POINT;

const FLOAT_SIGNED_1_POINT = '+,.1f';
const FLOAT_SIGNED_2_POINT = '+,.2f';
const FLOAT_SIGNED_3_POINT = '+,.3f';
const FLOAT_SIGNED = FLOAT_SIGNED_2_POINT;

const INTEGER = ',d';
const INTEGER_SIGNED = '+,d';

const PERCENT_1_POINT = ',.1%';
const PERCENT_2_POINT = ',.2%';
const PERCENT_3_POINT = ',.3%';
const PERCENT = PERCENT_2_POINT;

const PERCENT_SIGNED_1_POINT = '+,.1%';
const PERCENT_SIGNED_2_POINT = '+,.2%';
const PERCENT_SIGNED_3_POINT = '+,.3%';
const PERCENT_SIGNED = PERCENT_SIGNED_2_POINT;

const SI_1_DIGIT = '.1s';
const SI_2_DIGIT = '.2s';
const SI_3_DIGIT = '.3s';
const SI = SI_3_DIGIT;

const SMART_NUMBER = 'SMART_NUMBER';
const SMART_NUMBER_SIGNED = 'SMART_NUMBER_SIGNED';

const NumberFormats = {
  DOLLAR,
  DOLLAR_ROUND,
  DOLLAR_ROUND_SIGNED,
  DOLLAR_SIGNED,
  DURATION,
  DURATION_MS,
  DURATION_S,
  FLOAT,
  FLOAT_1_POINT,
  FLOAT_2_POINT,
  FLOAT_3_POINT,
  FLOAT_SIGNED,
  FLOAT_SIGNED_1_POINT,
  FLOAT_SIGNED_2_POINT,
  FLOAT_SIGNED_3_POINT,
  INTEGER,
  INTEGER_SIGNED,
  PERCENT,
  PERCENT_1_POINT,
  PERCENT_2_POINT,
  PERCENT_3_POINT,
  PERCENT_SIGNED,
  PERCENT_SIGNED_1_POINT,
  PERCENT_SIGNED_2_POINT,
  PERCENT_SIGNED_3_POINT,
  SI,
  SI_1_DIGIT,
  SI_2_DIGIT,
  SI_3_DIGIT,
  SMART_NUMBER,
  SMART_NUMBER_SIGNED,
};

export default NumberFormats;
