import Joi from 'joi';

const Schema = Joi.object().keys({
  quantity: Joi.number().required(),
});

export function validate(req, schema = Schema) {
  return Joi.validate(req.body, Schema);
}
