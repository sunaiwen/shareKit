var expect = chai.expect;
var SK = require('../js/shareKit.js');
// for karma
document.body.innerHTML = window.__html__['tests/karma.html'];
describe('Share Kit', function(){
    describe('Test Url Concat', function(){
        it('should return encode url', function(){
            var src = SK.prototype.urlConcat({
                a:'a',
                b:'bb\/\/',
                c: '123??%',
                d: 777,
                e:'888'
            }, 'http://www.baidu.com');
            var dest = 'http://www.baidu.com?'+'a=a&b=bb\/\/&c=123??%&d=777&e=888';

            expect(src).to.not.equal(dest);
            expect(decodeURIComponent(src)).to.equal(dest);
        });
    });

    describe('SK Object', function(){
        var evt;
        beforeEach(function(){
            evt = document.createEvent('MouseEvent');
            evt.initEvent('click', true, true);
        });
        describe('SK Configuration Test', function(){
            it('Should empty object has default options', function(){
                var sk = new SK();
                expect(sk).to.not.be.an('undefined');
                expect(sk.baseConf.title).to.equal(document.title);
                expect(sk.baseConf.link).to.equal(location.href);
                expect(sk.baseConf.desc).to.equal(SK.prototype.findDesc());
                expect(sk.baseConf.twitterName).to.be.an('undefined');
                expect(sk.baseConf.prefix).to.equal('shareKit');

                expect(sk.baseConf.wbOption).to.not.equal(undefined);
                expect(sk.baseConf.wbOption.appkey).to.equal('');
                expect(sk.baseConf.wbOption.uid).to.equal('');
            });
            it('Should object with configuration has some options', function(){
                var o = {
                    title: 'title',
                    link: 'http://baidu.com',
                    desc: 'Today isn\'t another day.',
                    twitterName: 'sunaiwen',
                    wbOption: {
                        appkey: '3125265748',
                        uid: '1624118717'
                    }
                };
                var sk = new SK(o);

                expect(sk.baseConf.title).to.equal(o.title);
                expect(sk.baseConf.link).to.equal(o.link);
                expect(sk.baseConf.desc).to.equal(o.desc);
                expect(sk.baseConf.twitterName).to.equal(o.twitterName);
                expect(sk.baseConf.wbOption).to.not.equal(undefined);
                expect(sk.baseConf.wbOption.appkey).to.equal('3125265748');
                expect(sk.baseConf.wbOption.uid).to.equal('1624118717');
            });
        });
        describe('SK init function Test', function(){
            var sk = new SK();
            it('Should have element and correct prefix', function(){
                expect(sk.wrapEle.className.indexOf('js-'+sk.baseConf.prefix)).to.not.equal(-1);
                expect(sk.qzEle.className.indexOf('js-'+sk.baseConf.prefix+'-qzone')).to.not.equal(-1);
            });
        });
        describe('SK elements\' event binding', function(){
            it('Should handler be fired', function(){
                var st = sinon.stub(SK.prototype, 'qzoneFunc');
                var sk = new SK();
                sk.qzEle.dispatchEvent(evt,true);
                expect(st.callCount).to.equal(1);
                st.restore();
            });

            it('Should bind an event correctly', function(done){
                var tr = 'empty';
                var st = sinon.stub(SK.prototype, 'twitterFunc', function(){
                    tr = 'twitter fire';
                    expect(tr).to.equal('twitter fire');
                    st.restore();
                    setTimeout(function(){
                        done();
                    }, 200);
                });
                var sk = new SK();
                sk.twEle.dispatchEvent(evt, true);
            });
        });
        describe('SK open window function test', function(){
            it('Should open window with correct url, title, and props', function(){
                SK.prototype.openWin({
                    url: 'http://www.baidu.com',
                    title: 'open baidu',
                    scrollbars: 'no',
                    menubar: 'no',
                    status: 'no',
                    height: 600,
                    width: 900,
                    left: 300,
                    top: 0
                });
            });
        });
        describe('The Qzone share function', function(){
            var args = null;
            var cache = SK.prototype.openWin;
            beforeEach(function(){
                var fakeOpenWin = function(){
                    args = arguments[0];
                };
                SK.prototype.openWin = fakeOpenWin;
            });
            it('Should qzoneFunc open a window with correct options', function(){
                var sk = new SK({
                    link: 'http://baidu.com',
                    title: 'qzone share function test',
                    twitterName: 'sunaiwen',
                    desc: 'this is a test testing qzone share function.'
                });

                sk.qzEle.dispatchEvent(evt, true);

                expect(args.menubar).to.equal('no');
                expect(args.resizable).to.equal('no');
                expect(args.status).to.equal('no');
                expect(args.toolbar).to.equal('no');
                expect(args.top).to.equal(50);
                expect(args.left).to.equal(200);
                expect(args.width).to.equal(600);
                expect(args.height).to.equal(650);
                expect(args.title).to.equal('Sharing to Qzone');
            });
            afterEach(function(){
                SK.prototype.openWin = cache;
            });
        });
        describe('The wechat share function', function(){
            it('Should show qrcode when outside wechat env', function(){
                var sk = new SK({
                    link: location.href
                });
                sk.wxEle.dispatchEvent(evt, true);
            });
        });
    });
});