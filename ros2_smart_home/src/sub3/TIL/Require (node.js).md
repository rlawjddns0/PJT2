[TOC]

# Require (node.js)

[참고1](https://medium.com/@chullino/require-exports-module-exports-%EA%B3%B5%EC%8B%9D%EB%AC%B8%EC%84%9C%EB%A1%9C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1d024ec5aca3)

[참고2](https://jongmin92.github.io/2016/08/25/Node/module-exports_exports/)

[참고3 공식문서](https://nodejs.org/api/modules.html#modules_module_id)

모듈을 불러올 때 require() 함수를 사용한다.



## 1. 사용법

### 간단한 예

```js
// foo.js 파일
const a = 10
```

```js
// bar.js 파일
console.log(a)
```



다음과 같이 bar.js를 바로 실행하면 에러가 뜬다.

```js
node bar.js
ReferenceError: a is not defined
```

이를 해결하기 위해서는 bar.js에 foo.js 를 불러와서 사용하면 된다.

```js
// bar.js 파일
const foo = require('./foo.js') // foo.js는 bar.js와 같은 경로에 위치함
console.log(foo.a)
```

그런데 이렇게만 하면 여전히 다음 에러가 뜬다.

```js
node bar.js
ReferenceError: a is not defined
```

이는 foo.js에 exports가 없기 때문으로, foo.js의 a를 사용하려면 다음과 같이 고쳐야 한다.

```js
// foo.js 파일
const a = 10
exports.a = a;
```

이제 bar.js를 실행하면 원하는 출력이 나온다.

```js
node bar.js
10
```



### 공식문서

```js
// foo.js 파일
const circle = require('./circle.js');
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
```

```js
// circle.js 파일
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```

- circle.js 모듈은 exports라는 오브젝트에 추가적인 property를 지정하여 area()와 circumference()라는 함수를 export하였다.  (exports.area, exports.circumference)

- 위 예에서 PI는 circle.js의 private 변수기 때문에 foo.js에서 직접 사용할수는 없다. 

이렇게 사용할 수 있는 이유는 require가 다음과 같은 형태를 가지기 때문이다.

```js
var require = function(path) {

 // ...

 return module.exports;
};
```

path의 js 모듈에서 module.exports 객체를 찾아서 반환하는 것이다. circle.js의 경우에는 다음 코드로 바꾸어 생각할 수 있다.

```js
var exports = module.exports = {};

const { PI } = Math;

exports.area = function(r) {
    return PI * r ** 2;
}
exports.circumference = function(r) {
    return 2 * PI * r;
}
```

빈 객체 구조에 새로운 함수를 넣은 것이고, foo.js에서는 이 객체를 require를 통해 받아서 사용하는 것이다.



다른 예로, module.exports에 클래스를 할당하는 경우도 있다.

```js
// square.js
// Assigning to exports will not modify module, must use module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```

```js
// bar.js 파일
const Square = require('./square.js'); // Square는 결국 square.js의 module.exports와 동일
const mySquare = new Square(2); // constructor(2)인 Square 클래스가 만들어짐
console.log(`The area of mySquare is ${mySquare.area()}`);
```

exports에 웬만한건 다 넣을 수 있을듯..



## 2. path, express 예시

이번 프로젝트에서 Websocket 서버 구동을 위한 서버 코드의 시작 부분에 다음과 같은 require 코드가 나온다.

```js
const path = require('path');
const express = require('express');
```

이는 Node.js에서 제공하는 모듈을 사용한 것으로, 다음 문서에서 확인할 수 있다.

[path](https://nodejs.org/api/path.html)

[express](https://expressjs.com/ko/)

각각 여러 가지 함수를 제공하는데, 우선 path를 살펴보자.

```js
path.basename(path[, ext]) // 경로의 마지막 부분을 return

path.delimiter // 경로 문자를 반환함. windows면 ;, POSIX면 :인데, 거의 쓸 일 없을듯

path.dirname(path) // 경로 반환 ex) path.dirname('/foo/bar/quux') => '/foo/bar'

path.extname(path) // 파일의 확장자 반환 ex) path.extname('index.html') => .html

path.format(pathObject) // 경로 합쳐서 보여주기
	/*예시
	path.format({
  		dir: 'C:\\path\\dir',
  		base: 'file.txt'
	});
	// Returns: 'C:\\path\\dir\\file.txt'
	*/
path.isAbsolute(path) // 주어진 경로가 절대경로인지 판별

path.join([...paths]) // 경로 합쳐서 반환
	/*예시
	path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
	// Returns: '/foo/bar/baz/asdf'
	*/
path.normalize(path) // 입력한 경로(.. 혹은 . 혹은 // 포함)를 풀어서 보여줌
path.parse(path) // 경로를 자동으로 나눠줌, 예시 보는게 좋을듯
	/*예시
    path.parse('C:\\path\\dir\\file.txt');
    Returns:
    { root: 'C:\\',
      dir: 'C:\\path\\dir',
      base: 'file.txt',
      ext: '.txt',
      name: 'file' }
    */
path.posix // posix에서 출력되는 형태가 필요할 때 섞어서 사용 ex) path.posix.basename(~)
path.relative(from, to) // from과 to를 비교해서 상대경로로 표현
path.resolve([...paths]) // 오른쪽에서 왼쪽으로 경로를 합치되 '/folder' 형태를 만나는 순간 리턴
	/*예시
	path.resolve('/temp','/abc','/name','dir','..');
	결과 /name
	*/
path.sep // 경로 구분자를 반환 => windows는 \ 이고, POSIX는 /
path.toNamespacedPath(path) // 경로를 namespace 경로로 반환.. 뭔소린지 잘 모르겠음
path.win32 // windows에서 출력되는 형태가 필요할 때 섞어서 사용 ex) path.win32.basename(~)
```

path에서 제공하는 함수들은 위와 같다. 경로와 관련된 여러 동작을 도와준다.



express는 node로 서버를 만들고 get, post API를 만들 때 사용한다.

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

앱이 3000번 포트에 대한 연결을 청취하고, '/' 경로로 get 요청이 오면 Hello World! 로 응답한다.

### 3. http 예시

[MDN 문서](https://developer.mozilla.org/ko/docs/Learn/Server-side/Express_Nodejs/Introduction)

[참고](https://velog.io/@zlor26/http-%EB%AA%A8%EB%93%88%EA%B3%BC-express-%EB%AA%A8%EB%93%88-%EC%B0%A8%EC%9D%B4)

http는 서버를 만들 때 사용하는 모듈로, express보다 좀 더 손이 많이 가는 모듈이라고 할 수 있을 것 같다.

server, request, response 객체로 나뉘고 필요한 기능을 직접 많이 개발해야 한다.

express에서는 자주 사용하는 기능을 따로 제공한다.



아래 링크를 확인해보면 좋을 듯

https://www.nextree.co.kr/p8574/