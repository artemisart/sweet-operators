'use strict'

// is proto a strict subclass of baseProto ?
function subclass(proto, baseProto) {
	while (proto = proto.__proto__)
		if (proto === baseProto)
			return true
	return false
}

// create an macro operator and the corresponding function
macro op {
	case { $context symmetric $name $precedence:lit $associativity $func:ident } => {
		var name = unwrapSyntax(#{ $name })
		var funcname = unwrapSyntax(#{ $func })
		letstx $funcname = [makeValue(funcname, #{ $context })]
		letstx $error = [makeValue('Operator '+funcname+' ('+name+') was called on an object that does not implement it', #{ $context })]
		return #{
			operator $name $precedence $associativity { $a, $b } => #{ $func($a, $b) }
			function $func(a, b) {
				// pick the most specialized implementation :
				// TODO handle null/undefined operands
				if ($funcname in b && subclass(b.__proto__, a.__proto__))
					b.$func(a)
				else if ($funcname in a)
					a.$func(b)
				else
					throw new Error($error)
			}
		}
	}
	case { $context asymmetric $name $precedence: lit $associativity $func: ident $opp: ident } => {
		throw new Error('not implemented')
	}
	case { $context unary $name $precedence:lit $func:ident } => {
		throw new Error('not implemented')
	}
}
macro ops {
	rule { symmetric $($name $precedence:lit $func:ident) ... } => {
		$(op symmetric $name $precedence left $func)
		...
	}
	rule { asymmetric $($name $precendence:lit $func:ident $opp:ident) ...} => {
		$(op asymmetric $name $precedence left $func $opp)
		...
	}
	rule { unary $($name $precedence:lit $func:ident) ... } => {
		$(op unary $name $precedence $func)
		...
	}
}

ops unary
	// new
	++	15	__inc__
	--	15	__dec__
	!	14	__not__
	~	14	__inv__
	+	14	__pos__
	-	14	__neg__
	// typeof void delete yield

// left associative
ops symmetric
	@	13	__matmul__
	*	13	__mul__
	/	13	__div__
	div	13	__intdiv__
	%	13	__remainder__ // js (%) operator is not a real modulo operator (see tests)
	mod	13	__mod__
	+	12	__add__
	-	12	__sub__
	>>	11 	__rshift__
	<<	11	__lshift__
	>>>	11	__rrshift__
	// in instanceof
	==	9	__eq__
	!=	9	__ne__
	// === !==
	&	8	__and__
	^	7	__xor__
	|	6	__or__
	// &&	5	__AND__
	// ||	4	__OR__

ops asymmetric
	<	10	__lt__	__ge__
	<=	10	__le__	__gt__
	>	10	__gt__	__le__
	>=	10	__ge__	__lt__

// pipe functions
operator (|>) 1 left { $a, $b } => #{ $b($a) }
// right associative
op symmetric ** 14 right __pow__


// builtin unary op precedence :

// new 16
// ++  15
// --  15
// TODO operator ! 14 { $a } => #{ __NEG($a) }
// operator (~) 14 { $a } => #{ __bINV($a) }
operator + 14 { $a } => #{ __POS($a) }
operator - 14 { $a } => #{ __NEG($a) }
// typeof  14
// void    14
// delete  14
// yield 2
// TODO operator (abs) ? { $a } => #{ __ABS($a) }

// builtin binary op precedence :

// TODO operator @ ? left { $a, $b} => #{ __MATMUL($a, $b) }
// TODO operator (**) ? left { $a, $b} => #{ __POW($a, $b) }
// floordiv ?
// in	10	left
// instanceof	10	left
operator (==) 10 left { $a, $b } => #{ $a.__eq__($b) }
operator (!=) 10 left { $a, $b } => #{ $a.__ne__($b) } // TODO default to !__eq__
// ===	9	left
// !==	9	left
// operator (is) ? left { $a, $b } => #{ __IS($a, $b) }
// operator (is not) ? left { $a, $b } => #{ __ISNOT($a, $b) }

// TODO implement mirrored operators for subclasses (-> call the most specific operator possible):
// function __LT(a, b)
// 	if b subclass of a
// 		return b.__gt__(a)
// 	else
// 		return a.__lt__(a)
//
// function __LE(a, b)
// 	if b subclass of a
// 		return b.__ge__(a)
// 	else
// 		return a.__le__(a)
//
// function __GT(a, b)
// 	if b subclass of a
// 		return b.__lt__(a)
// 	else
// 		return a.__gt__(a)
//
// function __GE(a, b)
// 	if b subclass of a
// 		return b.__le__(a)
// 	else
// 		return a.__ge__(a)
