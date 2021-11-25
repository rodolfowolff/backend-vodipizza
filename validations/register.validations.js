const validRegister = async (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  if (!name) {
    errors.push('Por favor, adicione seu nome.');
  } else if (name.length > 20) {
    errors.push('Seu nome não pode ter mais que 20 caracteres.');
  }

  if (!email) {
    errors.push('Por favor, adicione seu email.');
  } else if (!validateEmail(email)) {
    errors.push('O formato do email está incorreto.');
  }

  if (!password) {
    errors.push('Por favor, adicione sua senha.');
  } else if (password.length < 6 || password.length > 20) {
    errors.push('Senha deve conter no minimo 6 e no máximo 20 caracteres.');
  }

  if (!password2) {
    errors.push('Por favor, adciona o confirma senha.');
  } else if (password !== password2) {
    errors.push('A senha e confirma senha não são iguais.');
  }

  if (errors.length > 0) return res.status(400).json({ msg: errors });

  next();
};

function validPhone(phone) {
  const re = /^[+]/g;
  return re.test(phone);
}

function validateEmail(emailvalidate) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailvalidate).toLowerCase());
}

module.exports = {
  validRegister,
  validPhone,
  validateEmail,
};