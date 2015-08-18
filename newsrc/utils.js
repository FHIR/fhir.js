(function(){
    var  RTRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    function trim(text){
        return (text && text.toString().replace(RTRIM, "")) || "";
    };
    exports.trim = trim;

    function addKey(acc, str){
        if (!str){return null;}
        var pair = str.split("=").map(trim);
        var val = pair[1].replace(/(^"|"$)/g,'');
        if(val){acc[pair[0]] = val;}
        return acc;
    };

    var ClassToType = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object'
    };

    function type(obj){
        if(obj === undefined || obj === null){
            return String(obj);
        }
        return ClassToType[Object.prototype.toString.call(obj)];
    };

    exports.type = type;
}());
