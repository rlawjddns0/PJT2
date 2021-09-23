# 쓰레드(Thread)

http://pythonstudy.xyz/python/article/24-%EC%93%B0%EB%A0%88%EB%93%9C-Thread

**iot_udp.py**

```python
        # 로직 2. 멀티스레드를 이용한 데이터 수신
        thread = threading.Thread(target=self.recv_udp_data)
        thread.daemon = True 
        thread.start() 
```



### 쓰레드 설명 & 예시

파이썬 프로그램은 기본적으로 하나의 쓰레드에서 실행된다. (Single Thread)

-> 하나의 메인 쓰레드가 파이썬 코드를 순차적으로 실행함



코드를 병렬로 실행하기 위해서는 별도의 쓰레드를 생성해야 하고, 파이썬에서 쓰레드를 생성하기 위해서는 threading 모듈이나 thread 모듈을 사용해야 한다. threading 모듈은 thread 모듈 위에서 구현된 High 레벨 모듈로, 일반적으로 threading 모듈을 사용한다.



파이썬에서 쓰레드를 실행하기 위해서는 threading 모듈의 threading.Thread() 함수를 호출하여 Thread  객체를 얻은 후 Thread 객체의 start() 메서드를 호출하면 된다. 이런 쓰레드는 함수 혹은 메서드를 실행할 때 사용하는데, 다음 두 가지 방법으로 함수나 메서드를 구현한다.

(1) 쓰레드가 실행할 함수 혹은 메서드를 작성

(2) threading.Thread 로부터 파생된 파생클래스를 작성하여 사용



sub3에서는 (1) 방식을 사용하였다. 구체적인 방법은 다음과 같다.

- 쓰레드가 실행할 함수를 작성하고, 그 함수명을 threading.Thread() 함수의 target argument에 지정한다.
- 여기서 함수를 지정할 때, 예를 들어 `def sum():` 이런 식으로 함수를 만들었다면 `target=sum` 으로 지정해야 한다. `target=sum()` 처럼 지정을 하면 sum()의 결과를 지정하는 것이 된다.
- 만약 쓰레드가 실행하는 함수 혹은 메서드에 입력 파라미터를 전달해야 한다면 args 혹은 kwargs(키워드 파라미터라면) 에 필요한 파라미터를 지정하면 된다.
  - args는 튜플로 파라미터를 전달, kwargs는 dict로 파라미터를 전달한다.

sum 함수의 예를 보자.

```python
import threading
 
def sum(low, high):
    total = 0
    for i in range(low, high):
        total += i
    print("Subthread", total)
 
t = threading.Thread(target=sum, args=(1, 100000))
t.start()
 
print("Main Thread")
```



(2) 방식은 알아보지 않는다.



### 데몬 쓰레드

Thread 클래스에서 daemon 속성은 서브쓰레드(내가 만든 쓰레드)가 데몬 쓰레드인지 아닌지를 지정하는 것이다.

데몬 쓰레드란 백그라운드에서 실행되는 쓰레드로 메인 쓰레드가 종료되면 즉시 종료되는 쓰레드이다. 반면 데몬 쓰레드가 아니면 해당 서브쓰레드는 메인 쓰레드가 종료할지라도 자신의 작업이 끝날 때까지 계속 실행된다.

Thread 객체의 daemon 속성을 True로 설정한 후 start() 하면 해당 서브쓰레드는 데몬 쓰레드가 되고, 아래와 같이 메인 쓰레드가 종료되면 메서드를 마저 실행하지 못하고 바로 데몬 쓰레드를 종료하게 된다. daemon 속성은 디폴트 False로, 별도로 지정하지 않으면 메인 쓰레드가 종료되어도 서브쓰레드는 끝까지 작업을 수행한다.

```python
import threading, requests, time
 
def getHtml(url):
    resp = requests.get(url)
    time.sleep(1)
    print(url, len(resp.text), ' chars')
 
# 데몬 쓰레드
t1 = threading.Thread(target=getHtml, args=('http://google.com',))
t1.daemon = True 
t1.start()
```

