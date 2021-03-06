<!DOCTYPE HTML>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<script>
/* 单体 */
 
/**
 * 单例模式
 *
 * 定义：
 * 保证一个类仅有一个实例，并提供一个访问它的全局访问点。
 *
 * 本质：
 * 控制实例数目
 *
 * 单例模式是用来保证这个类在运行期间只会被创建一个类实例，另外，单例模式还提供了一个全局唯一访问这个类实例的访问点，就是getInstance方法。不管采用懒汉式还是俄汉式的实现方式，这个全局访问点是一样的。
 */
 
// 懒汉式
// 在使用对象实例的时候才会创建
var Singleton = (function(){
    // 顶一个以变量来存储创建好的类实例
    var uniqueInstance = null;
    // 单例可以有自己的属性
    var singletonData = '';
 
    var Singleton = function(){
        //...
    };
 
    return {
        // 定义一个方法来为客户端提供类实例
        getInstance: function(){
            if(uniqueInstance === null) {
                uniqueInstance = new Singleton();
            }
 
            return uniqueInstance;
        },
        // 单例可以有自己的操作
        singletonOperation: function(){
            // 功能处理
        },
        // 让外部通过这些方法来访问属性的值
        getSingletonData: function(){
            return singletonData;
        }
    };
}());
 
// 俄汉式
// 在装载类的时候就创建对象实例。
var Singleton = (function(){
    var uniqueInstance = new Singleton();
    var singletonData = '';
 
    function Singleton(){}
 
    return {
        getInstance: function(){
            return uniqueInstance;
        },
        singletonOperationL function(){},
        // 让外部通过这些方法来访问属性的值
        getSingletonData: function(){
            return singletonData;
        }
    };
}());
 
 
/*------------------
 划分命名空间
 ------------------------*/
var MyNameSpace = {
    findProduct: function (id) {
        //...
    },
    others: function () {
 
    }
    //Othermethods can go here as well
};
 
// Later in your page, another programmer adds
var resetProduct = $('reset-product-button');
var findProduct = $('find-product-button');   // nothing was overwriitten
 
 
// 包装特定网页专用代码的单体骨架
/* Generic Page Object */
var Namespace = Namespace || {};
Namespace.PageName = {
 
    // Page constants
    CONSTANT_1: true,
    CONSTANT_2: 10,
 
    // Page methods
    method1: function () {
    },
    method2: function () {
    },
 
    // Initialization method
    init: function () {
 
    }
};
 
// Invoke the initialization method after the page loads
ADS.addLoadEvent(Namespace.PageName.init);
 
// 下面的单体会查找并劫持（hijiack）一个特定的表单
/* RegPage singleton,page handler object */
var GiantCorp = GiantCorp || {};
GiantCorp.RegPage = {
    // Constants
    FORM_ID: 'reg-form',
    OUTPUT_ID: 'reg-results',
 
    // form handling methods
    handleSubmit: function (e) {
        e.preventDefault();     // stop the normal form submission
 
        var data = {};
        var inputs = GiantCorp.RegPage.formEl.getElementsByTagName('input');
 
        // collext the values of the input fields in the form
        for (var i = 0, len = inputs.length; i < len; i++) {
            data[inputs[i].name] = inputs[i].value;
        }
 
        // send the form values back to the server
        GiantCorp.RegPage.sendRegistration(data);
    },
    sendRegistration: function (data) {
        // make an XHR request and call displayResult() when
        // the response was received
        // ...
    },
    displayResult: function (response) {
        // output the response directly into the output element,
        // we are assuming the server will send back formatted HTML
        GiantCorp.RegPage.outputEl.innerHTML = response;
    },
    // initialization method
    init: function () {
        // get the form and output elements
        GiantCorp.RegPage.formEl = $(GiantCorp.RegPage.FORM_ID);
        GiantCorp.RegPage.outputEl = $(GiantCorp.RegPage.OUTPUT_ID);
 
        // Hijack the form submission
        ADS.addEvent(GiantCorp.RegPage.formEl, 'submit', GiantCorp.RegPage.handleSubmit);
    }
};
 
// invoke the initialization method after the page loads
ADS.addLoadEvent(GiantCorp.RegPage.init);
 
 
/*---------------------
 拥有私用成员
 -----------------------*/
// 使用下划线表示法
/* DataParser singleton,converts charcter delimited strings into array */
GiantCorp.DataParser = {
    // private methods
    _stripeWhitespace: function (str) {
        return str.replace(/\s+/, '');
    },
    _stringSplit: function (str, delimiter) {
        return str.split(delimiter);
    },
    //public method
    stringToArray: function (str, delimiter, stripWS) {
        if (stripWS) {
            str = this._stripeWhitespace(str);
        }
        var outputArray = this._stringSplit(str, delimiter);
        return outputArray;
    }
};
 
// 使用闭包
/*
 与构造函数中创建正真的私用成员的做法相似。先前的做法是把变量和函数定义在构造函数体内（不使用this关键字）以使其成为私用成员，此外还在构造函数体内定义了所有的特权方法并用this关键字使其可被外界访问。每生成一个该类的实例时，所有声明在构造函数内的方法和属性都会再次创建一份。这可能会非常低效。
 因为单体只会被实例化一次，所以不用担心自己在构造函数中声明了多少成员。
 */
/* Singleton as an Object Literal */
MyNamespace.Singleton = {};
 
/* Singleton with Private Members,step 1. */
MyNamespace.Singleton = function () {
    return {};
}();
// 上面两个例子中所创建的两个MyNamespace.Singleton完全相同
 
// 在匿名函数定义之外再嵌套上一对圆括号，这在所创建的单体较为庞大时尤其有用
MyNamespace.Singleton = (function () {
    return {};
})();
 
/* Singleton with Private Members,step 2. */
MyNameSpace.Singleton = (function () {
    return {
        // public members
        publicAttribute1: true,
        publicAttribute2: 10,
        publicMethod1: function () {
            //...
        },
        publicMethod2: function (args) {
            //...
        }
    };
})();
 
// 添加私用成员
/* Singleton with Private Member,step 3. */
MyNameSpace.Singleton = (function () {
    // private members
    var privateAttribute1 = false;
    var privateAttribute2 = [1, 2, 3];
 
    function privateMethod1() {
        //...
    }
 
    function privateMethod2(args) {
        //...
    }
 
    return {
        // public members
        publicAttribute1: true,
        publicAttribute2: 10,
        publicMethod1: function () {
            //...
        },
        publicMethod2: function (args) {
            //...
        }
    };
})();
 
/*
 这种单体模式又称模块模式，指的是它可以把一批相关方法和属性组织为模块并起到划分命名空间的作用
 */
/* now using true private methods */
GiantCorp.DataParser = (function () {
    // private attributes
    var whitespaceRegex = /\s+/;
 
    // private methods
    function stripWhiteSpace(str) {
        return str.replace(whitespaceRegex, '');
    }
 
    function stringSplit(str, delimiter) {
        return str.split(delimiter);
    }
 
    // everything returned in the object literal is public,but can access
    // the members in the closure create above
    return {
        // public method
        stringToArray: function (str, delimiter, stripWS) {
            if (stripWS) {
                str = stripWhiteSpace(str);
            }
            var outputArray = stringSplit(str, delimiter);
            return outputArray;
        }
    };
})();
 
 
/*----------------
 惰性实例化
 -------------------*/
/*
 单体对象都是在脚本加载时被创建出来。对于资源密集型的或配置开销甚大的单体，也许更合理的做法是将其实例化推迟到需要使用它的时候。这种技术被称为惰性加载(lazy loading)，它最常用于那些必须加载大量数据的单体。
 而那些被用作命名空间，特定网页专用代码包装器或组织相关实用方法的工具的单体最好还是立即实例化。
 这种惰性加载单体的特别之处在于，对他们的访问必须借助于一个静态方法。应该这样调用其方法：Singleton.getInstance().methodName(),getInstace()方法会检查该单体是否已经被实例化。如果还没有，那么它将创建并返回其实例；如果单体已经实例化，那么它将返回现有实例
 */
// 第一步是把单体的所有代码移到一个名为constructor的方法中
/* general skeleton for a lazy loading singleton, */
MyNameSpace.Singleton = (function () {
    var uniqueInstance; // private attribute that holds the single instance
    function constructor() {
        // all od the normal singleton code goes here
        // private members
        var privateAttribute1 = false;
        var privateAttribute2 = [1, 2, 3];
 
        function privateMethod1() {
            //...
        }
 
        function privateMethod2(args) {
            //...
        }
 
        return {
            // public members
            publicAttribute1: true,
            publicAttribute2: 10,
            publicMethod1: function () {
                //...
            },
            publicMethod2: function (args) {
                //...
            }
        };
    }
 
    return {
        getInstance: function () {
            // control code goes here
            if (!uniqueInstance) {
                // instantiate only if the instance doesn't exist
                // 如果没有被实例化，则把constructor()的结果赋给uniqueInstance
                uniqueInstance = constructor();
            }
            // 被实例化后直接返回uniqueInstance，不需要每次都执行函数
            return uniqueInstance;
        }
    };
})();
 
// usage
var MNS = MyNameSpace.Singleton;
MNS.getInstance().publicMethod1();
/*
 这样做会创建一个全局变量，所以最好还是把它声明在一个特定网页专用代码包装器单体中。在存在单体嵌套的情况下，会出现一些作用域方面的问题。在这种场合下访问其他成员最好是用完全限定名（比如：GiantCorp.SingletonName）而不是this。
 */
 
/*----------------
 分支 branching
 ------------------*/
/*
 分支是一种用来把浏览器间的差异封装到在运行期间进行设置的动态方法中的技术。
 举个例子,假设我们需要创建一个返回XHR对象的方法。这种XHR对象在大多数浏览器中是XMLHttpRequest类的实例，而在IE早起版本中则是某种ActiveX类的实例。这样一个方法通常会进行某种浏览器嗅探或对象探测。如果不用分支技术，那么每次调用这个方法时，所有那些浏览器嗅探代码都要再次运行，会缺乏效率。
 */
// 可以创建两个不同的对象字面量，并根据某种条件将其中之一赋给那个变量
MyNameSpace.Singleton = (function () {
    var objectA = {
        method1: function () {
            //...
        },
        method2: function () {
            //...
        }
    };
    var objectB = {
        method1: function () {
            //...
        },
        method2: function () {
            //...
        }
    };
 
    return (someCondition) ? objectA : objectB;
})();
 
// 用分支技术创建XHR对象
/* simpleXhrFactory singleton,step 1 */
var SimpleXhrFactory = (function () {
    // the three branches
    var standard = {
        createXhrObject: function () {
            return new XMLHttpRequest();
        }
    };
    var activeXNew = {
        createXhrObject: function () {
            return new ActiveXObject('Msxml2.XMLHTTP');
        }
    };
    var activeXOld = {
        createXhrObject: function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }
    };
 
    // To assign the branch, try each method,return whatever doesn't fail
    var testObject;
    try {
        testObject = standard.createXhrObject();
        return standard;
    } catch (e) {
        try {
            testObject = activeXNew.createXhrObject();
            return activeXNew;
        } catch (e) {
            try {
                testObject = activeXOld.createXhrObject();
                return activeXOld;
            } catch (e) {
                throw new Error('No XHR object found in this environment');
            }
        }
    }
})();
 
/*
单体模式之利
单体模式的主要好处在于它对代码的组织作用。把相关方法和属性组织在一个不会被多次实例化的单体中。可以使代码的调试和维护变得更轻松。描述性的命名空间还可以增强代码的自我说明性，有利于新手阅读和理解。把你的方法包裹在单体中，可以防止他们被其它程序员误改，还可以防止全局命名空间被一大堆变量弄得一团糟。
单体模式的一些高级变体可以在开发周期的后期用于对脚本进行优化，提升其性能。使用惰性实例化技术，可以直到需要一个对象的时候才创建它，从而减少那些不需要它的用户承受的不必要的内存消耗（还可能包带宽消耗）。分支技术则可以用來创建高效的方法，不用管浏览器或环境的兼容性如何。通过根据运行时的条件确定赋给单体变量的对象字面量，你可以创建出为特定环境量身定制的方法，这种方法不会再每次调用时都一再浪费时间去检查运行环境。
 */
 
/*
单体模式之弊
由于单体模式提供的是一种单体访问，所以它有可能导致模块间的强耦合。有时创建一个可实例化的类更为可取，哪怕它只会被实例化一次。因为这种模式可能会导致类间的强耦合，所以它不利于单元测试。你无法单独测试一个调用了来自单体的方法的类，而只能把它与那个单体作为一个单元一起测试。单体最好还是留给定义命名空间和实现分支型方法这些用途。在这些情况下，耦合不是什么问题。
 */
</script>
</body>
</html>
　　