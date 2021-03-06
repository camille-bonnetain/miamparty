/*
    Les regexs utiles sont stockés ici
*/

function regexEmail(field) {
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailReg.test(field);
}

function regexPassword(field) {
  const passwordReg = /^.{6,128}$/;
  return passwordReg.test(field);
}

function regexName(field) {
  const nameReg = /^[A-Z][A-Za-z\é\è\ê\-]{2,49}$/;
  return nameReg.test(field);
}

function regexAddress(field) {
  const addressReg = /^[A-Za-z\é\è\ê\-]{0,49}$/;
  return addressReg.test(field);
}

export default {
  regexEmail,
  regexPassword,
  regexName,
  regexAddress
};
