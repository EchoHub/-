Function.prototype.myCall = function() {
    const self = arguments[0];
    const args = Array.from(arguments).slice(1);
    self.fn = this;
    const result = self.fn(...args);
    delete self.fn;
    return result;
}

Function.prototype.myApply = function() {
    const self = arguments[0];
    const args = arguments[1];
    self.fn = this;
    const result = self.fn(...args);
    delete self.fn;
    return result;
}

Function.prototype.myBind = function() {
    const self = arguments[0];
    const args_ = Array.from(arguments).slice(1);
    self.fn = this;
    return function(...args) {
        const result = self.fn(...(args_.concat(args)));
        delete self.fn;
        return result;
    }
}

var self = {
    name: 'happy',
}
function sayName(age, intro) {
    console.log('My Name is ',this.name, age, intro);
}
sayName.myCall(self, 11, 'hhhh');
sayName.myApply(self, [11, 'hhhh']);
var a = sayName.myBind(self, 11);
a('666')