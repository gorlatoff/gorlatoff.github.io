    // ===== Класс для рациональных чисел =====
    class Rational {
      constructor(numerator, denominator) {
        this.numerator = numerator;
        this.denominator = denominator;
        this.reduce();
      }
      reduce() {
        const divisor = Rational.gcd(this.numerator, this.denominator);
        this.numerator /= divisor;
        this.denominator /= divisor;
      }
      toDecimal() {
        return this.numerator / this.denominator;
      }
      toCents(){
        math.log(this.numerator / this.denominator, math.pow(2,(1/1200)))
      }
      static multiply(a, b) {
        return new Rational(a.numerator * b.numerator, a.denominator * b.denominator);
      }
      static divide(a, b) {
        return new Rational(a.numerator * b.denominator, a.denominator * b.numerator);
      }
      static gcd(n, m) {
        return m === 0 ? n : Rational.gcd(m, n % m);
      }
      static nok(n, m) {
        return n * m / Rational.gcd(n, m);
      }
      // НОД для двух рациональных чисел
      static gcdOfRationals(a, b) {
        const gcdOfNumerators = Rational.gcd(a.numerator, b.numerator);
        const gcdOfDenominators = Rational.nok(a.denominator, b.denominator);
        return new Rational(gcdOfNumerators, gcdOfDenominators);
      }
    }