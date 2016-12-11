var characters = new Array(
	'emt',
	'eru',
	'kakashi',
	'kirito');

var friendA = 'a';
	

function getCharacter(){
	var index = Math.ceil(Math.random()*4)-1;	//生成0-3的随机数
	return characters[index];
}

function getOther(array){
	for(var i = 0;i<characters.length - 1;i++){
		if(array.indexOf(characters[i]) === -1)
			return characters[i];
	}
	return friendA;
}

exports.getCharacter = getCharacter;
exports.getOther = getOther;