// スタイルシートの設定を行う関数で使用するクラス
var Style = function () {
	this.selectors = [];
	console.log("さあ始めるよ！");
};
// セレクタをセット
Style.prototype.setSelector = function (selectorName) {
	// すでにそのセレクタが登録されていなければ追加
	// 1. はじめてのセレクタの場合は配列に入れる
	if (this.selectors.length === 0) {
		this.addSelector(selectorName);
	} else {
		// 既に配列に入っているものを調べて、入っていなければ入れる
		if (!this.getSelectorObject(selectorName)) {
			this.addSelector(selectorName);
		} else {
			console.log("このセレクタ(" + selectorName + ")はもう登録されているよ");
		}
	}
};
// セレクタを追加
Style.prototype.addSelector = function (selectorName) {
	var selector = new Selector(selectorName);
	selector.Style = this;
	this.selectors.push(selector);
};
// セレクタの状態変更を一手に引き受ける関数
// 第1引数: セレクタ名 2: property / offsets / size 3: 変更する値の項目名 4; 変更する値
Style.prototype.setSelectorValue = function (selectorName, type, name, value) {
	// まずはそのセレクタがあるかどうかを調べる
	this.setSelector(selectorName);
	// あれば(作ったら)、プロパティを追加する
	if (this.getSelectorObject(selectorName)) {
		if (type == "property") {
			this.getSelectorObject(selectorName).setProperty(name, value);
		} else if (type == "offset") {
			this.getSelectorObject(selectorName).setOffset(name, value);
		} else if (type == "size") {
			this.getSelectorObject(selectorName).setSize(name, value);
		}
	}
};
// セレクタ名を引数で受けて、配列の中から該当するセレクタのオブジェクトを返す
Style.prototype.getSelectorObject = function (selectorName) {
	for (var i = 0, j = this.selectors.length; i < j; i++) {
		if (this.selectors[i].name == selectorName) {
			return this.selectors[i];
		}
	}
};
// スタイルを書き出してその文字列を返す
Style.prototype.write = function () {
	var str = "";
	for (var i = 0, j = this.selectors.length; i < j; i++) {
		str += this.selectors[i].name + " {\n";
		for (var k = 0, l = this.selectors[i].property.length; k < l; k++) {
			str += "  " + this.selectors[i].property[k].name + ":";
			str += " " + this.selectors[i].property[k].value + ";\n";
		}
		str += "}\n";
	}
	return str;
};
// セレクタについて
var Selector = function (selectorName) {
	this.name = selectorName;
	this.property = [];
	this.offset = {};
};
// プロパティを追加
Selector.prototype.setProperty = function (propertyName, propertyValue) {
	// プロパティが存在していない場合(通常)
	if (!this.getPropertyObject(propertyName)) {
		var p = {
			name: propertyName,
			value: propertyValue
		};
		this.property.push(p);
	} else { // すでにプロパティが存在していた場合は引数で指定された値で上書き
		this.getPropertyObject(propertyName).value = propertyValue;
	}
};
Selector.prototype.setOffset = function (position, value) {
  this.offset[position] = value;
  console.log(this.offset[position]);
};
Selector.prototype.setSize = function (which, value) {
	if (which.toLowerCase() == "width") {
		this.width = value;
	} else if (which.toLowerCase() == "height") {
		this.height = value;
	}
};
// プロパティ名を引数で受けて、配列の中から該当するプロパティのオブジェクトを返す
Selector.prototype.getPropertyObject = function (propertyName) {
	for (var i = 0, j = this.property.length; i < j; i++) {
		if (this.property[i].name == propertyName) {
			return this.property[i];
		}
	}
};



var style = new Style();
var $tag;

var builtin_ikait = function (env) {
	env.defBuiltinFunc('setCSS', function () {
		// 第1引数にセレクタを、第2引数以降にプロパティを指定する
		var s = arguments[0], p = "";
		// styleタグがあるかどうかを確認、無ければ追加
		if (!$tag) {
			$tag = $('<style />');
			$('body').append($tag);
		}
		// 引数を順々にプロパティにセット
		for (var i = 1, j = arguments.length; i < j; i++) {
			p = arguments[i].replace(/[\s　]/g, "");
			if (p) {
				var tmp = p.split(/[\:\;]/g, 2);
				if (tmp.length == 2) style.setSelectorValue(s, "property", tmp[0], tmp[1]);
			}
		}
		// スタイルを書きだす
		$tag.html(style.write());
	});
	env.defBuiltinFunc('getOffset', function (selectorName, position) {
		switch (position) {
			case "top":
			case "left":
				style.setSelectorValue(selectorName, "offset", position, $(selectorName).offset()[position]);
				return style.getSelectorObject(selectorName).offset[position];
		}
	});
	env.defBuiltinFunc('getWidth', function (selectorName) {
		style.setSelectorValue(selectorName, "size", "width", $(selectorName).width());
		return style.getSelectorObject(selectorName).width;
	});
	env.defBuiltinFunc('getHeight', function (selectorName) {
		style.setSelectorValue(selectorName, "size", "Height", $(selectorName).height());
		return style.getSelectorObject(selectorName).height;
	});
	env.defBuiltinFunc('bgc', function (f) {
		var cc = "";
		if ((f + "").length < 3) {
			for (var i = 0; i < 3; i++) {
				cc += f + "";
			}
		} else {

		}
		return "background-color:#" + cc;
	});
};
