var evalScheem = function (expr, env) {
	// Numbers evaluate to themselves
	if (typeof expr === 'number') {
		return expr;
	}
	// Strings are variable references
	if (typeof expr === 'string') {
		return env[expr];
	}
	// Look at the head of list for operation
	switch (expr[0]) {
		case '+':
			return evalScheem(expr[1], env) + evalScheem(expr[2], env);
		case '-':
			return evalScheem(expr[1], env) - evalScheem(expr[2], env);
		case '*':
			return evalScheem(expr[1], env) * evalScheem(expr[2], env);
		case '/':
			return evalScheem(expr[1], env) / evalScheem(expr[2], env);
		case '<':
			return ((evalScheem(expr[1]) < evalScheem(expr[2])) ? '#t' : '#f');
		case 'quote':
			return expr[1];
        case 'cons':
            var leftExpr = evalScheem(expr[1], env);
            var rightExpr = evalScheem(expr[2], env);
            return [leftExpr].concat(rightExpr);
        case 'car':
            return evalScheem(expr[1], env).shift();
        case 'cdr':
            var newList = evalScheem(expr[1], env);
            newList.shift();
            return newList;
		case 'define':
            env[expr[1]] = expr[2];
            return 0;
        case 'set!':
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case '=':
            var eq =
                (evalScheem(expr[1], env) ===
                 evalScheem(expr[2], env));
            if (eq) return '#t';
            return '#f';
        case 'if':
            return (evalScheem(expr[1], env) === '#t') ?
                evalScheem(expr[2], env): evalScheem(expr[3], env);
		case 'begin':
            var len = expr.length;
            var i = 0;
            var result = 0;
            for ( i = 1; i < len; i++ )
                result = evalScheem(expr[i], env);
            return result;
		
		
	}
};

if (typeof module !== 'undefined') {
	module.exports.evalScheem = evalScheem;
}
