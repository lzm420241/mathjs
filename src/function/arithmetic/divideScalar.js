'use strict'

function factory (type, config, load, typed) {
  const numeric = load(require('../../type/numeric'))
  const getTypeOf = load(require('../../function/utils/typeof'))

  /**
   * Divide two scalar values, `x / y`.
   * This function is meant for internal use: it is used by the public functions
   * `divide` and `inv`.
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Quotient, `x / y`
   * @private
   */
  const divideScalar = typed('divide', {
    'number, number': function (x, y) {
      return x / y
    },

    'Complex, Complex': function (x, y) {
      return x.div(y)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.div(y)
    },

    'Fraction, Fraction': function (x, y) {
      return x.div(y)
    },

    'Unit, number | Fraction | BigNumber': function (x, y) {
      const res = x.clone()
      // TODO: move the divide function to Unit.js, it uses internals of Unit
      const one = numeric(1, getTypeOf(y))
      res.value = divideScalar(((res.value === null) ? res._normalize(one) : res.value), y)
      return res
    },

    'number | Fraction | BigNumber, Unit': function (x, y) {
      let res = y.clone()
      res = res.pow(-1)
      // TODO: move the divide function to Unit.js, it uses internals of Unit
      const one = numeric(1, getTypeOf(x))
      res.value = divideScalar(x, ((y.value === null) ? y._normalize(one) : y.value))
      return res
    },

    'Unit, Unit': function (x, y) {
      return x.divide(y)
    }

  })

  return divideScalar
}

exports.factory = factory
