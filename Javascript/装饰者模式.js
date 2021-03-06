<!DOCTYPE html>
<html>
<head>
    <title>装饰者模式</title>
    <meta charset="utf-8">
</head>
<body>
 
<script>
/**
 * 装饰者模式
 *
 * 定义：
 * 动态地给一个对象添加一些额外的职责。就增加功能来说，装饰者模式比生成子类更为灵活。
 *
 * 本质：
 * 动态组合
 *
 * 装饰着模式是一种为对象增添特性的技术，它并不使用创建新子类这种手段。装饰者模式（decorator pattern）可用来透明地把对象包装在具有同样接口的另一对象之中。这样一来，你可以给一个方法添加一些行为，然后将方法调用传递给原始对象。相对于创建子类来说，使用装饰者对象是一种更灵活的选择。这种模式特别适合js，因为通常js代码并不怎么依赖对象的类型。
 */
/*
 装饰者结构
 
 装饰者可用于为对象增加功能，它可以用来替换大量子类。
 我们继续用自行车的例子。上次的例子中AcmeBicycleShop类的时候，顾客可以购买的自行车有4钟型号。
 */
var Bicycle = new Interface('Bicycle', ['assemble', 'wash', 'ride', 'repair']);
/* BicycleShop class (abstract) */
var BicycleShop = function () {
};
BicycleShop.prototype = {
    sellBicycle: function (model) {
        var bicycle = this.createBicycle(model);
 
        bicycle.assemble();
        bicycle.wash();
 
        return bicycle;
    },
    createBicycle: function (model) {
        throw new Error('Unsupported operation on an abstract class.');
    }
};
 
function extend(subClass, superClass) {
    function F() {
    }
 
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
 
    subClass.superclass = superClass.prototype;
 
    if (superClass.prototype.constructor === Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}
/* AcmeBicycleShop class */
var AcmeBicycleShop = function () {
};
extend(AcmeBicycleShop, BicycleShop);
AcmeBicycleShop.prototype.createBicycle = function (model) {
    var bicycle;
 
    switch (model) {
        case 'The Speedster':
            bicycle = new Speedster();
            break;
        case 'The Lowrider':
            bicycle = new Lowrider();
            break;
        case 'The Comfort Cruiser':
        default:
            bicycle = new ComfortCruiser();
    }
    Interface.ensureImplements(bicycle, Bicycle);
    return bicycle;
};
 
/*
 后来这家商店开始为每一种自行车提供一些额外的特色配件。现在顾客再加点钱就可以买到带前灯，尾灯或铃铛的自行车。每一种可选配件都会影响到售价和车的组装方法。这个问题最基本的解决办法是为选件的每一种组合创建一个子类：
 */
var AcmeComfortCruiser = function () {
}; // The superclass for all of the other comfort cruisers
var AcmeComfortCruiserWithHeadlight = function () {
};
var AcmeComfortCruiserWidthTaillight = function () {
};
//...
/*
 但是这种办法根本行不通，原因很简单，这需要实现100多个类（那4个父类每个都要派生24个子类，再加上父类本身）。而且这样做的话你不得不对工厂方法进行修改，以便能创建分别属于这100个子类的自行车来卖给顾客。
 装饰者模式对于实现这些选择再合适不过了。你不用为自行车和选件的每一种组合创建一个子类，而只需创建4个新类（一个类针对一种选择）即可。这些类与那4钟自行车类一样都要实现Bicycle接口，但它们只被用作这些自行车类的包装类。在这些选件类上进行的方法调用将被转到它们包装的自行车类上，有时会稍有修改。
 在这个例子中，选件类就是装饰者，而自行车类是它们的组件。装饰者对其组件进行了透明包装，二者可以互换使用，这是因为他们实现了同样的接口。下面我们来看应该怎样实现自行车装饰者类。首先要改一下接口，加入一个getPrice方法：
 */
// the Bicycle interface
var Bicycle = new Interface('Bycycle', ['assemble', 'wash', 'ride', 'repair', 'getPrice']);
/*
 所有自行车类和选件装饰者都要实现这个接口。AcmeComfortCruiser类大致是这个样子（不需要为使用装饰者而进行什么修改）
 */
/* the AcmeComfortCruiser class. */
var AcmeComfortCruiser = function () {
    // implements Bicycle
};
AcmeComfortCruiser.prototype = {
    assemble: function () {
    },
    wash: function () {
    },
    ride: function () {
    },
    repair: function () {
    },
    getPrice: function () {
        return 399.00;
    }
};
/*
 这些选件类的作用基本上就是传递发生在它们身上的方法调用。为了简化这个任务，也为了方便以后增添更多选件，我们将创建一个抽象类BicycleDecorator，所有选件类都从此派生。它提供了Bicycle接口所要求的各个方法的默认版本：
 */
// the BicycleDecorator abstract decorator class
var BicycleDecorator = function (bicycle) {
    // implements Bicycle
    Interface.ensureImplements(bicycle, Bicycle);
    this.bicycle = bicycle;
};
BicycleDecorator.prototype = {
    assemble: function () {
        return this.bicycle.assemble();
    },
    wash: function () {
        return this.bicycle.wash();
    },
    ride: function () {
        return this.bicycle.ride();
    },
    repair: function () {
        return this.bicycle.repair();
    },
    getPrice: function () {
        return this.bicycle.getPrice();
    }
};
 
/*
 它的构造函数接受一个对象参数，并将其用作该装饰者的组件。该类实现了Bicycle接口，它所实现的每一个方法所做的只是在其组件上调用同名方法。BicycleDecorator类是所有选件类的超类。这与组合模式非常类似。对于那些不需要修改的方法，选件类只要使用从BicycleDecorator继承而来的版本即可，而这些方法又会在组件上调用同样的方法，因此选件类对于任何客户代码都是透明的。
 有了BicycleDecorator，创建各种选件类很容易，只需要调用超类的构造函数并改写某些方法即可。
 */
// HeadlightDecorator class.
var HeadlightDecorator = function (bicycle) {
    // implements Bicycle
    // call the superclass's constructor
    HeadlightDecorator.superclass.constructor.call(this, bicycle);
};
extend(HeadlightDecorator, BicycleDecorator);
HeadlightDecorator.prototype.assemble = function () {
    return this.bicycle.assemble() + ' Attach headlight to handlebars';
};
HeadlightDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 15.00;
};
// 这个类冲定义了需要进行装饰的两个方法
 
/*
 使用装饰者
 要创建一辆带前灯的自行车，首先应该创建自行车的实例，然后以该自行车对象为参数实例化前灯选件。在此之后，应该只是用这个HeadlightDecorator对象，你完全可以将其实为一辆自行车，而把它是一个装饰者对象抛之脑后
 */
var myBicycle = new AcmeComfortCruiser();   // Instantiate the bicycle
console.log(myBicycle.getPrice());  // returns 399.00
myBicycle = new HeadlightDecorator(myBicycle);  // Decorate the bicycle object
console.log(myBicycle.getPrice());
/*
 这里用来存放HeadlightDecorator实例的不是另一个变量，而是用来存放自行车实例的同一变量。这意味着此后将不能在访问原来的那个自行车对象，不过没关系，你以后不再需要这个对象。那个装饰者完全可以和自行车对象互换使用。这也意味着你可以随心所欲地嵌套使用多种装饰者。假如你创建一个TaillightDecorator类，那么可以将其与HeadlightDecorator结合使用：
 */
// TaillightDecorator class
var TaillightDecorator = function (bicycle) {
    // implements Bicycle
    // call the superclass's constructor
    TaillightDecorator.superclass.constructor.call(this, bicycle);
};
extend(TaillightDecorator, BicycleDecorator);
TaillightDecorator.prototype.assemble = function () {
    return this.bicycle.assemble() + ' Attach taillight to the seat post.';
};
TaillightDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 9.00;
};
 
var myBicycle = new AcmeComfortCruiser();    // Instantiate the bicycle
console.log(myBicycle.getPrice());  // returns 399.00
 
// Decorate the bicycle object with a taillight
myBicycle = new TaillightDecorator(myBicycle);
console.log(myBicycle.getPrice());  // Now returns 423.00
/*
 你可以如法炮制，创建对应于前挂货篮和铃铛的装饰者。通过在运行期间动态应用装饰者，可以创建出具有所有需要的特性的对象，而不用去维护那100个不同的子类。要是前灯的价格发生变化，你只要在HeadlightDecorator类这一个地方予以更新即可。维护工作因此也更容易管理得多。
 */
 
/*
 接口在装饰着模式中的角色
 
 装饰者模式颇多得益于接口的使用。装饰者最重要的特点之一就是它们可以用来替代其组件。在本例中，这就是说任何原来使用AcmeComfortCruiser实例的地方，都可以使用HeadlightDecorator实例，为此不必对代码进行任何修改。这是通过确保所有装饰着对象都实现了Bicycle接口而达到的。
 接口在此发挥着两个方面的作用。首先，它说明了装饰者必须实现哪些方法，这有助于防止开发过程中的错误。通过创建一个具有一批固定方法的接口，你所面对的就不再是一个游移不定的目标。此外，它还可以在新版工厂方法中用来确保所创建的对象都实现了必须的方法。
 如果装饰着对象与其组件不能互换使用，它就丧失了其功能。这是装饰着模式的关键特点，要注意防止装饰者和组件出现接口方面的差异。这种模式的好处之一就是透明地用新对象装饰现有系统中的对象，而这并不会改变代码中的其他东西。只有装饰着和组件实现了同样的接口才能做到这一点。
 */
 
/*
 装饰者模式与组合模式比较
 
 装饰者模式和组合模式之间有许多共同点。装饰者对象和组合对象都是用来包装别的对象（那些对象在组合模式中称为子对象，而在装饰者模式中称为组件），它们都与所包装的对象实现同样的接口并且会把任何方法调用传递给这些对象。像BicycleDecorator这种及其基本的装饰者甚至可以被视为一个简单的组合对象。
 组合模式是一种结构型模式，用于把众多子对象组织为一个整体。藉此程序员与大批对象打交道时可以将它们当作一个对象来对待，并将他们组织为层次性的树。通常它并不修改方法调用，而只是将其沿组合对象与子对象的链向下传递，直到到达并落实在叶对象上。
 装饰者模式也是一种结构型模式，但它并非用于组织对象，而是用于在不修改现有对象或从其派生子类的前提下为其增添职责。在一些较简单的例子中，装饰者会透明而不加修改地传递所有方法调用，不过，创建装饰者的目的就在于对方法进行修改。HeadlightDecorator就修改了assemble和getPrice方法，其做法是先传递方法调用，然后修改其返回结果。
 尽管简单的组合对象可等同于简单的装饰者，这二者却有着不同的焦点。组合对象并不修改方法调用，其着眼点在于组织子对象。而装饰者存在的唯一目的就是修改方法调用而不是组织子对象，因为子对象只有一个。
 */
 
/*
 装饰者修改其组件的方式
 
 在方法之后添加行为
 具体而言就是先调用组件的方法，并在其返回后实施一些附加的行为。HeadlightDecorator的getPrice方法就是一个简单的例子：
 HeadlightDecorator.prototype.getPrice = function(){
 return this.bicycle.getPrice() + 35.00;
 };
 
 这一过程可以多次重复：
 */
var myBicycle = new AcmeComfortCruiser();
console.log(myBicycle.getPrice());     // returns 399.00
myBicycle = new HeadlightDecorator(myBicycle);
myBicycle = new HeadlightDecorator(myBicycle);
console.log(myBicycle.getPrice());
/*
 在方法之前添加行为
 如果行为修改发生在执行组件方法之前，那么要么必须把装饰者行为安排在调用组件方法之前，要么必须设法修改传递给组件方法的参数值。下面的例子实现了一个提供车架颜色选择的装饰者：
 */
// FrameColorDecorator class.
var FrameColorDecorator = function (bicycle, frameColor) {
    // implements Bicycle
    FrameColorDecorator.superclass.constructor.call(this, bicycle);
    this.frameColor = frameColor;
};
extend(FrameColorDecorator, BicycleDecorator);  // extend the superclass
FrameColorDecorator.prototype.assemble = function () {
    return 'Paint the frame ' + this.frameColor + ' and allow it to dry.' + this.bicycle.assemble();
};
FrameColorDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 30.00;
};
 
// Instantiate the bicycle
var myBicycle = new AcmeComfortCruiser();
// Decorate the bicycle object with the frame color
myBicycle = new FrameColorDecorator(myBicycle, 'red');
// Decorate the bicycle object with the first headlight
myBicycle = new HeadlightDecorator(myBicycle);
// Decorate the bicycle object with the second headlight
myBicycle = new HeadlightDecorator(myBicycle);
// Decorate the bicycle object with a taillight
myBicycle = new TaillightDecorator(myBicycle);
console.log(myBicycle.assemble());
/*
 'Paint the frame red and allow it to dry.(full instructions for assembling the bike itself go here) Attach headlight to handlebars.Attach headlight to handlebars.Attach taillight to the seat post.'
 */
 
/*
 替换方法
 有时为了实现新行为必须对方法进行整体替换。在此情况下，组件方法不会被调用（或虽然被调用但其返回值会被抛弃）。下面我们将创建一个用来实现自行车的终生保修的装饰者：
 */
// LifetimeWarrantyDecorator class.
var LifetimeWarrantyDecorator = function (bicycle) {
    // implements Bicycle
    LifetimeWarrantyDecorator.superclass.constructor.call(this, bicycle);
};
extend(LifetimeWarrantyDecorator, BicycleDecorator);
LifetimeWarrantyDecorator.prototype.repair = function () {
    return 'This bicycle is covered by a lifetime warranty.Please take it to an authorized Acme Repair Center.';
};
LifetimeWarrantyDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 199.00;
};
/*
 这个装饰者把组件的repair方法替换为一个新方法，而组件的方法则再也不会被调用。装饰者也可以根据某种条件决定是否替换组件方法，在条件满足时替换方法，否则就使用组件的方法。
 下面这个例子创建的装饰者用于实现规定了保修期的保修：
 */
// TimedWarrantyDecorator class.
var TimedWarrantyDecorator = function (bicycle, coverageLengthInYears) {
    // implements Bicycle
    TimedWarrantyDecorator.superclass.constructor.call(this, bicycle);
    this.coverageLength = coverageLengthInYears;
    this.expDate = new Date();
    var coverageLengthInMs = this.coverageLength * 365 * 24 * 60 * 60 * 1000;
    this.expDate.setTime(this.expDate.getTime() + coverageLengthInms);
};
extend(TimedWarrantyDecorator, BicycleDecorator);
TimedWarrantyDecorator.prototype.repair = function () {
    var repairInstructions;
    var currentDate = new Date();
    if (currentDate < this.expDate) {
        repairInstructions = 'This bicycle is currently covered by a warranty.Please take it to an authorized Acme Repair Center.';
    } else {
        repairInstructions = this.bicycle.repair();
    }
    return repairInstructions;
};
TimedWarrantyDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + (40.00 * this.coverageLength);
};
/*
 这个例子中的getPrice和repair方法都会因保修期的长短而有所变化。如果尚在保修期内，你会得到“把自行车送到维修中心”这样的提示，否则被调用的将是组件的repair方法。
 在此之前的那些装饰者的应用顺序并不重要。但是，它们都必须放在最后应用，或至少要放在所有其它修改repair方法的装饰者之后应用。在使用替换组件方法的装饰者时，必须留意用装饰者包装自行车的顺序。使用工厂方法可以简化这一使用过程，但不管是否使用工厂方法，如果顺序至关紧要，那么装饰者就失去了部分灵活性。本节之前所讲的所有装饰者按任何顺序应用都可以正常发挥作用，因此可以根据需要透明而又动态地添加它们。而在引入替换组件方法的装饰者之后，必须设法确保正确的顺序应用装饰者。
 */
 
/*
 添加新方法
 前面的例子所讲的修改都发生在接口所定义的方法中（组件也具有这些方法），但这并不是一种必然的要求。装饰者也可以定义新方法，不过，要想稳妥的实现这一点并不容易。要想使用这些新方法，外围代码首先必须知道有这样一些新方法。由于这些新方法并不是在接口中定义的，而且它们是动态添加的，因此有必要进行类型检查，以验明用于包装组件对象的最外层装饰者。与用新方法装饰组件对象相比，对现有方法进行修改更容易实施，而且更不容易出错，这是因为采用后一种做法时，被装饰的对象用起来与之前没什么不同，外围代码也就不需要修改。
 
 在装饰者中添加新方法有时也是为类增添功能的一种强有力手段。我们可以用这种装饰者为自行车对象增添一个按铃方法。这是一个新功能，没有装饰者自行车就不可能执行这个任务：
 */
// BellDecorator class
var BellDecorator = function (bicycle) {
    // implements Bicycle
 
    // Call the superclass
    BellDecorator.superclass.constructor.call(this, bicycle);
};
// Extend the superclass
extend(BellDecorator, BicycleDecorator);
BellDecorator.prototype.assemble = function () {
    return this.bicycle.assemble() + ' Attach bell to handlebars';
};
BellDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 6.00;
};
BellDecorator.prototype.ringBell = function () {
    return 'Bell rung.';
};
 
/*
 这与先前讲过的装饰者非常相似，差别只在于它实现了ringBell这个未见于接口中的方法：
 */
var myBicycle = new AcmeComfortCruiser();
myBicycle = new BellDecorator(mybicycle);
console.log(myBicycle.ringBell());  // 'Bell rung.'
/*
 BellDecorator必须放在最后应用，否则这个新方法将无法访问。这是因为其它装饰者只能传递他们知道的方法，也即那些定义在接口中的方法。由于其他装饰者都不知道ringBell方法，如果你在添加了铃铛之后再添加前灯的话，那么BellDecoraotr中定义的新方法实际上会被HeadlightDecorator覆盖:
 */
var myBicycle = new AcmeComfortCruiser();
myBicycle = new BellDecorator(myBicycle);
myBicycle = new HeadlightDecorator(myBicycle);
console.log(myBicycle.ringBell());  // Method not found.
 
// The BicycleDecorator abstract decorator class, improved.
var BicycleDecorator = function (bicycle) {
    // implements Bicycle
    this.bicycle = bicycle;
    this.interface = Bicycle;
 
    /*
     Loop through all of the attributes of this.bicycle and create pass-through methods for any methods that aren't currently implemented.
     */
    outerloop:for (var key in this.bicycle) {
        // Ensure that the property is a function
        if (typeof this.bicycle[key] !== 'function') {
            continue outerloop;
        }
        // Ensure that the method isn't in the interface.
        for (var i = 0, len = this.interface.methods.length; i < len; i++) {
            if (key === this.interface.methods[i]) {
                continue outerloop;
            }
        }
 
        // Add the new method.
        var that = this;
        (function (methodName) {
            that[methodName] = function () {
                return that.bicycle[methodName]();
            };
        })(key);
    }
};
 
BicycleDecorator.prototype = {
    assemble: function () {
        return this.bicycle.assemble();
    },
    wash: function () {
        return this.bicycle.wash();
    },
    ride: function () {
        return this.bicycle.ride();
    },
    repair: function () {
        return this.bicycle.repair();
    },
    getPrice: function () {
        return this.bicycle.getPrice();
    }
};
/*
 接口中的方法都如通常一样定义在BocycleDecorator的prototype中。BicycleDecorator构造函数对组件对象进行检查，并为所找到的每一个未见于接口中的方法创建一个新的通道方法。这样一来，外层的装饰者就不会掩盖内层装饰者定义的新方法，你可以自由自在地创建个中实现新方法的装饰者，而不用担心这些新方法无法访问。
 */
 
/**
 工厂的角色
 
 如果必须确保某种特定顺序，那么可以为此使用工厂对象。实际上，不管顺序是否要紧，工厂都很适合于创建装饰对象。本节将重写AcmeBicycleShop类的createBicycle方法，以便用户可以指定自行车要配的选件。这些选件将被转化为装饰者，并在方法返回之前被应用到新创建的自行车对象上。
 */
// 原来的AcmeBicycleShop factory class.
var AcmeBicycleShop = function () {
};
extend(AcmeBicycleShop, BicycleShop);
AcmeBicycleShop.prototype.createBicycle = function (model) {
    var bicycle;
    switch (model) {
        case 'The Speedster':
            bicycle = new AcmeSpeedster();
            break;
        case 'The Lowrider':
            bicycle = new AcmeLowrider();
            break;
        case 'The Flatlander':
            bicycle = new AcmeFlatlander();
            break;
        case 'The Comfort Cruiser':
        default:
            bicycle = new AcmeComfortCruiser();
    }
 
    Interface.ensureImplements(bicycle, Bicycle);
    return bicycle;
};
 
/*
 这个类的改进版允许用户指定香味自行车配的选件。在这里，使用工厂模式可以统揽各种类（既包括自行车类也包括装饰者类）。把所有这些信息保存在一个地方，用户就可以把实际的类名与客户代码隔离开，这样以后添加新类或修改现有类也就更容易。
 */
// AcmeBicycleShop factory class, with decorators.
var AcmeBicycleShop = function () {
};
extend(AcmeBicycleShop, BicycleShop);
AcmeBicycleShop.prototype.createBicycle = function (model, options) {
    // Instantiate the bicycle object.
    var bicycle = new AcmeBicycleShop.models[model]();
 
    // Iterate through the options and instantiate decorators
    for (var i = 0, len = options.length; i < len; i++) {
        var decorator = AcmeBicycleShop.options[options[i].name];
        if (typeof decorator !== 'function') {
            throw new Error('Decorator ' + options[i].name + ' not found.');
        }
        var argument = options[i].arg;
        bicycle = new decorator(bicycle, argument);
    }
 
    // Check the interface and return the finished object
    Interface.ensureImplements(bicycle, Bicycle);
    return bicycle;
};
 
// Model name to class name mapping.
AcmeBicycleShop.models = {
    'The Speedster': AcmeSpeedster,
    'The Lowrider': AcmeLowrider,
    'The Flatlander': AcmeFlatlander,
    'The Comfort Cruiser': AcmeComfortCruiser
};
 
// Option name to decorator class name mapping.
AcmeBicycleShop.options = {
    'headlight': HeadlightDecorator,
    'taillight': TaillightDecorator,
    'bell': BellDecorator,
    'basket': BasketDecorator,
    'color': FrameColorDecorator,
    'lifetime warranty': LifetimeWarrantyDecorator,
    'timed warranty': TimedWarrantyDecorator
};
/*
 如果顺序很重要，那么可以添加一些代码，在使用选件数组实例化装饰者之前对其进行排序。
 用工厂实例化自行车对象有许多好处。首先，不必了解自行车和装饰者的各种类名，所有这些信息都封装在AcmeBicycleShop类中。因此添加自行车型号和选件非常容易，只要把它们添加到AcmeBicyckeShop.models或AcmeBicycleShop.options数组中即可。
 */
// 不使用工厂
var myBicycle = new AcmeSpeedster();
myBicycle = new FrameColorDecorator(myBicycle, 'blue');
myBicycle = new HeadlightDecorator(myBicycle);
myBicycle = new TaillightDecorator(myBicycle);
myBicycle = new TimedWarrantyDecorator(myBicycle, 2);
 
/*
 采用这种直接实例化对象的做法，与客户端代码紧密耦合在一起的类不下5个。与此相比，使用了工厂的做法，与客户端代码耦合在一起的只有一个类，即那个工厂本身：
 */
var alecsCruisers = new AcmeBicycleShop();
var myBicycle = alecsCruisers.createBicycle('The Speedter', [
    {name: 'color', arg: 'blue'},
    {name: 'headlight'},
    {name: 'tailight'},
    {name: 'timed warranty', arg: 2}
]);
/*
 如果有必要的话，工厂可以对选件进行排序。某些装饰者修改组件方法的方式决定了它们需要最先或最后被应用。在此情况下工厂的这种作用尤其有用。那种会替换组件方法而不是对其进行扩充的装饰者需要放在最后创建，以确保其成为最外层的装饰者。
 */
 
/**
 * 函数装饰者
 *
 * 装饰者并不局限于类。你也可以创建用来包装独立的函数和方法的装饰者。
 */
/*
 下面是一个简单的函数装饰者的例子，这个装饰者包装了另一个函数，其作用在于将被包装者的返回结果改为大写形式：
 */
function upperCaseDecorator(func) {
    return function () {
        return func.apply(this, arguments).toUpperCase();
    };
}
 
function getDate() {
    return (new Date()).toString();
}
var getDateCaps = upperCaseDecorator(getDate);
console.log(getDate()); // Wed Mar 06 2013 15:05:16 GMT+0800 (中国标准时间)
console.log(getDateCaps()); // WED MAR 06 2013 15:05:49 GMT+0800 (中国标准时间)
 
VellDecorator.prototype.ringBellLoudly = upperCaseDecorator(BellDecorator.prototype.ringBell);
var myBicycle = new AcmeComfortCruiser();
myBicycle = new BellDecorator(myBicycle);
console.log(myBicycle.ringBell());  // 'Bell rung.'
console.log(myBicycle.ringBellLoudly());    // 'BELL RUNG'
 
 
// 函数装饰者在对另一个函数的输出应用某种格式或执行某种转换这方面很有用处。
 
/*
 装饰者模式的适用场合
 
 如果需要为类增添特性或职责，而从该类派生子类的解决办法并不实际的话，就应该使用装饰者模式。派生子类之所以会不实际，最常见的原因是需要增添的特性的数量和组合要求使用大量子类。自行车商店的例子就说明了这一点。这个例子中涉及7钟不同的自行车选件，其中一些选件你还可以应用多次，这意味着如果不采用装饰者模式的话，要达到同样的目的需要数以千计的子类。从这个意义上讲，装饰者模式甚至可以被视为一种优化模式，因为在此场合下它节省的代码量可达几个数量级。
 
 如果需要为对象增添特性而又不想改变使用该对象的代码的话，也可以采用装饰者模式。因为装饰着可以动态而又透明地修改对象，所以它们很适合于修改现有系统这一任务。相比卷入创建和维护子类的麻烦，创建和应用一些装饰者往往要省事得多。
 */
 
/*
 装饰者模式之利
 
 装饰者是在运行期间为对象增添特性或职责的有力工具。在自行车上点那个例子中，通过使用装饰者，你可以动态地为自行车对象添加可选的特色配件。在只有部分对象需要这些特性的情况下装饰者模式的好处尤为突出。如果不采用这种模式，那么要想实现同样的效果必须使用大量子类。
 装饰者的运作过程是透明的，这就是说你可以用它包装其他对象，然后继续按之前使用那些对象的方法来使用它。从MethodProfiler这个示例中可以看到，这一切甚至可以动态实现，不用事先知道组件对象的接口。在为现有对象添砖加瓦这方面，装饰者模式为程序员带来了极大的灵活性。
 
 
 装饰者模式之弊
 
 装饰者模式的缺点主要表现在两个方面。首先，在遇到用装饰者包装起来的对象时，那些依赖于类型检查的代码会出问题。尽管js中很少使用严格的类型检查，但是如果你的代码中执行了这样的检查，那么装饰者是无法匹配所需要的类型的。通常装饰者对客户代码来说是完全透明的，不过，在这种情况下，客户代码就能感知装饰者与其组件的不同。
 第二，使用装饰者模式往往会增加架构的复杂程度。这种模式常常要引入许多小对象，它们看起来比较相似，而实际功能却大相径庭。装饰者模式往往不太容易理解，对于那些不熟悉这种模式的开发人员而言尤其如此。此外，实现具有动态接口的装饰者（如MethodProfiler）涉及的语法细节有时也会令人生畏。在设计一个使用了装饰着模式的架构时，你必须多花点心思，确保自己的代码有良好的文档说明，并且容易理解。
 */
 
</script>
 
 
<script>
    function $(id){
        return document.getElementById(id);
    }
</script>
<script>
    // 方法性能分析器
    // ListBuilder class.
    var ListBuilder = function (parent, listLength) {
        this.parent = $(parent);
        this.listLength = listLength;
    };
    ListBuilder.prototype = {
        buildList: function (container) {
            var list = document.createElement('ul');
            list.setAttribute('id', container);
            this.parent.appendChild(list);
            var len = this.listLength;
 
            while (len) {
                var item = document.createElement('li');
                list.appendChild(item);
                --len;
            }
        },
        removeLists: function(id){
            var ele = $(id);
            ele.parentNode.removeChild(ele);
        }
    };
 
    // SimpleProfiler class.
    var SimpleProfiler = function (component) {
        this.component = component;
    };
    SimpleProfiler.prototype = {
        buildList: function () {
            var startTime = (new Date()).getTime();
            this.component.buildList();
            var elapsedTime = (new Date()).getTime() - startTime;
            console.log('buildList:' + elapsedTime + ' ms');
        }
    };
    /*
     var list = new ListBuilder('list-container', 5000);
     list = new SimpleProfiler(list);
     list.buildList();
     */
    // 通用化改造
    // MethodProfiler class.
    var MethodProfiler = function (component) {
        this.component = component;
        this.timers = {};
 
        for (var key in this.component) {
            // Ensure that the property is a function
            if (typeof this.component[key] !== 'function') {
                continue;
            }
 
            // Add the method
            var that = this;
            (function (methodName) {
                that[methodName] = function () {
                    that.startTimer(methodName);
                    var returnValue = that.component[methodName].apply(that.component, arguments);
                    that.displayTime(methodName, that.getElapsedTime(methodName));
                    return returnValue;
                };
            })(key);
        }
    };
    MethodProfiler.prototype = {
        startTimer: function (methodName) {
            this.timers[methodName] = new Date().getTime();
        },
        getElapsedTime: function (methodName) {
            return new Date().getTime() - this.timers[methodName];
        },
        displayTime: function (methodName, time) {
            console.log(methodName + ': ' + time + ' ms');
        }
    };
 
    var list = new ListBuilder('list-container', 5000);
    list = new MethodProfiler(list);
    list.buildList('ol');
    list.buildList('ul');
    list.removeLists('ul');
    list.removeLists('ol');
 
 
    /* Title: Decorator
    Description: dynamically adds/overrides behaviour in an existing method of an object
    */
 
    var tree = {};
    tree.decorate = function () {
        console.log('Make sure the tree won\'t fall');
    };
 
    tree.getDecorator = function (deco) {
        tree[deco].prototype = this;
        // console.log(tree[deco].prototype);
        /*
         tree
         tree.BlueBalls
         tree.Angel
         */
        return new tree[deco];
    };
 
    tree.RedBalls = function () {
        this.decorate = function () {
            this.RedBalls.prototype.decorate();
            //console.log(this.RedBalls.prototype.decorate);
            /*
             function () {
             this.Angel.prototype.decorate();
             console.log(this.Angel.prototype.decorate);
             console.log('An angel on the top');
             }
             */
            console.log('Put on some red balls');
        }
    };
 
    tree.BlueBalls = function () {
        this.decorate = function () {
            this.BlueBalls.prototype.decorate();
            //console.log(this.BlueBalls.prototype.decorate);
            /*
             function () {
             console.log('Make sure the tree won\'t fall');
             }
             */
            console.log('Add blue balls');
        }
    };
 
    tree.Angel = function () {
        this.decorate = function () {
            this.Angel.prototype.decorate();
            //console.log(this.Angel.prototype.decorate);
            /*
             this.BlueBalls.prototype.decorate();
             console.log(this.BlueBalls.prototype.decorate);
             console.log('Add blue balls');
             */
            console.log('An angel on the top');
        }
    };
 
    tree = tree.getDecorator('BlueBalls');
    tree = tree.getDecorator('Angel');
    tree = tree.getDecorator('RedBalls');
 
    tree.decorate();
 
 
</script>
</body>
</html>
　　

标签: javascript设计模式
好文要顶 