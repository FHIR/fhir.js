adapter = null

exports.setAdapter =  (x)-> adapter = x
exports.getAdapter =  ()-> adapter
exports.adapter = { xhr: 'xhr' }