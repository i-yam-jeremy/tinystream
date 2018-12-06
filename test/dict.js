const assert = require('assert');

const dict = require('../src/dict');
const initDictionary = dict.initDictionary;
const arrayEquals = dict.arrayEquals;
const dictIndexOf = dict.dictIndexOf;
const isInDictionary = dict.isInDictionary;

describe('LZW Dictionary', () => {
	describe('initDictionary()', () => {
		it('ensures the dictionary initializes correctly', () => {
			let dict = initDictionary();
			assert.deepEqual(dict, [[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24],[25],[26],[27],[28],[29],[30],[31],[32],[33],[34],[35],[36],[37],[38],[39],[40],[41],[42],[43],[44],[45],[46],[47],[48],[49],[50],[51],[52],[53],[54],[55],[56],[57],[58],[59],[60],[61],[62],[63],[64],[65],[66],[67],[68],[69],[70],[71],[72],[73],[74],[75],[76],[77],[78],[79],[80],[81],[82],[83],[84],[85],[86],[87],[88],[89],[90],[91],[92],[93],[94],[95],[96],[97],[98],[99],[100],[101],[102],[103],[104],[105],[106],[107],[108],[109],[110],[111],[112],[113],[114],[115],[116],[117],[118],[119],[120],[121],[122],[123],[124],[125],[126],[127],[128],[129],[130],[131],[132],[133],[134],[135],[136],[137],[138],[139],[140],[141],[142],[143],[144],[145],[146],[147],[148],[149],[150],[151],[152],[153],[154],[155],[156],[157],[158],[159],[160],[161],[162],[163],[164],[165],[166],[167],[168],[169],[170],[171],[172],[173],[174],[175],[176],[177],[178],[179],[180],[181],[182],[183],[184],[185],[186],[187],[188],[189],[190],[191],[192],[193],[194],[195],[196],[197],[198],[199],[200],[201],[202],[203],[204],[205],[206],[207],[208],[209],[210],[211],[212],[213],[214],[215],[216],[217],[218],[219],[220],[221],[222],[223],[224],[225],[226],[227],[228],[229],[230],[231],[232],[233],[234],[235],[236],[237],[238],[239],[240],[241],[242],[243],[244],[245],[246],[247],[248],[249],[250],[251],[252],[253],[254],[255]]);
		});
	});

	describe('arrayEquals()', () => {
		it('empty array', () => {
			assert.equal(arrayEquals([], []), true);
		});
		it('unequal length', () => {
			assert.equal(arrayEquals([], [1]), false);
			assert.equal(arrayEquals([], [1, 2]), false);
			assert.equal(arrayEquals([26, 22], []), false);
			assert.equal(arrayEquals([63, 46, 2, 17, 1000, 9], [2, 74]), false);
		});
		it('singletons', () => {
			assert.equal(arrayEquals([1], [1]), true);
			assert.equal(arrayEquals([62], [62]), true);
			assert.equal(arrayEquals([999], [999]), true);
			assert.equal(arrayEquals([162], [1]), false);
			assert.equal(arrayEquals([0], [1]), false);
			assert.equal(arrayEquals([37], [99]), false);
		});
		it('unequal multiple elements', () => {
			assert.equal(arrayEquals([1, 2, 3], [1, 2, 4]), false);
			assert.equal(arrayEquals([67, 92, 11], [67, 11, 92]), false);
			assert.equal(arrayEquals([0, 782], [23, 66]), false);
			assert.equal(arrayEquals([0, 61, 3, 164, 87], [1, 61, 3, 164, 87]), false);
			assert.equal(arrayEquals([9, 13, 44, 6], [9, 12, 44, 6]), false);
			assert.equal(arrayEquals([255, 0], [0, 255]), false);
		});
		it('equal multiple elements', () => {
			assert.equal(arrayEquals([1, 2, 3], [1, 2, 3]), true);
			assert.equal(arrayEquals([67, 92, 11], [67, 92, 11]), true);
			assert.equal(arrayEquals([0, 782], [0, 782]), true);
			assert.equal(arrayEquals([0, 61, 3, 164, 87], [0, 61, 3, 164, 87]), true);
			assert.equal(arrayEquals([9, 13, 44, 6], [9, 13, 44, 6]), true);
			assert.equal(arrayEquals([169, 1], [169, 1]), true);
		});
	});

	describe('dictIndexOf()', () => {
		it('singleton elements', () => {
			let dict = initDictionary();

			for (let i = 0; i < dict.length; i++) {
				assert.equal(dictIndexOf(dict, dict[i]), i);
			}
		});
		it('multiple elements', () => {
			let dict = initDictionary();
			dict.push([1, 3]);
			dict.push([1, 3, 5, 68, 256]);
			dict.push([257, 102, 59]);

			assert.equal(dictIndexOf(dict, [1, 3]), 256);
			assert.equal(dictIndexOf(dict, [1, 3, 5, 68, 256]), 257);
			assert.equal(dictIndexOf(dict, [257, 102, 59]), 258);
		});
		it('non-existant elements', () => {
			let dict = initDictionary();
			dict.push([1, 2, 3, 4, 5, 6]);
			dict.push([0, 78, 99, 256]);
			dict.push([256, 255, 0]);
			dict.push([253, 252, 99]);
			dict.push([251, 252]);
			
			assert.equal(dictIndexOf(dict, [3, 4]), -1);
			assert.equal(dictIndexOf(dict, [257]), -1);
			assert.equal(dictIndexOf(dict, []), -1);
			assert.equal(dictIndexOf(dict, [251, 252, 253]), -1);
		});
	});
	describe('isInDictionary()', () => {
		it('singleton elements', () => {
			let dict = initDictionary();

			for (let i = 0; i < dict.length; i++) {
				assert.equal(isInDictionary(dict, dict[i]), true);
			}
		});
		it('multiple elements', () => {
			let dict = initDictionary();
			dict.push([79, 64]);
			dict.push([69, 73, 11, 233]);
			dict.push([199, 257, 48]);

			assert.equal(isInDictionary(dict, [79, 64]), true);
			assert.equal(isInDictionary(dict, [69, 73, 11, 233]), true);
			assert.equal(isInDictionary(dict, [199, 257, 48]), true);
		});
		it('non-existant elements', () => {
			let dict = initDictionary();
			dict.push([1, 2, 3, 4, 5, 6]);
			dict.push([0, 78, 99, 256]);
			dict.push([256, 255, 0]);
			dict.push([253, 252, 99]);
			dict.push([251, 252]);
			
			assert.equal(isInDictionary(dict, [3, 4]), false);
			assert.equal(isInDictionary(dict, [257]), false);
			assert.equal(isInDictionary(dict, []), false);
			assert.equal(isInDictionary(dict, [251, 252, 253]), false);
		});
	});
});
