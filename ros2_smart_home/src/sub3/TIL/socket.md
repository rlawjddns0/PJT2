# socket

https://docs.python.org/ko/3/library/socket.html#socket.socket

https://recipes4dev.tistory.com/153 요약 정리

소켓은 프로그램이 네트워크에서 데이터를 송수신할 수 있도록, 네트워크 환경에 연결할 수 있게 만들어진 연결부를 뜻한다.

![네트워크 소켓(Socket)](https://t1.daumcdn.net/cfile/tistory/99C70D505C7DD7E30A)

소켓을 사용하여 네트워크 통신 기능을 구현하는 소켓 프로그래밍은 소켓을 만들고, 만들어진 소켓을 통해 데이터를 주고 받는 절차에 대한 이해가 필요하고, 운영체제나 프로그래밍 언어에서 제공하는 소켓 API 사용법을 숙지해야 수월하게 할 수 있다.



### 1. 클라이언트 소켓과 서버 소켓

클라이언트 소켓: 연결 요청

서버 소켓: 수신

두 개의 시스템 또는 프로세스가 소켓을 통해 네트워크 연결(Connection)을 만들기 위해서는 최초 어느 한 곳에서 그 대상이 되는 곳으로 연결을 요청해야 한다.

- 따라서 클라이언트는 **IP 주소와 포트 번호**로 식별되는 대상에게 자신이 데이터 송수신을 위한 네트워크 연결을 수립할 의사가 있음을 알려야 한다.

- 서버 소켓은 어떤 연결 요청을 받아들일 것인지(포트 번호로 식별)를 미리 시스템에 등록하여, 요청이 왔을 때 해당 요청을 처리할 수 있도록 준비해야 한다.

클라이언트와 서버로 나눠 놨지만 역할, 순서만 다를 뿐 형태는 같다. 

**주의** - 클라이언트 소켓과 서버 소켓이 직접 데이터를 주고 받는 것은 아니고, 서버 소켓이 연결 요청을 받아들이고 나면 직접적인 데이터 송수신은 서버 소켓의 연결 요청 수락의 결과로 만들어지는 **새로운 소켓이 처리**한다.



#### 1-1. 클라이언트 소켓의 API 호출 흐름

[1] 소켓 생성(create)

[2] 연결 요청(connect)

[3] 연결이 받아들여지면 데이터를 송수신(send/recv)

[4] 모든 처리가 완료되면 소켓을 닫음(close)



#### 1-2. 서버 소켓의 API 호출 흐름

[1] 소켓 생성(create)

[2] 서버가 사용할 IP주소와 포트 번호를 생성한 소켓에 결합(bind)

[3] 클라이언트로부터 요청이 오는지 주시(listen)

[4] 요청이 수신되면 받아들여 데이터 통신을 위한 소켓을 생성(accept)

[5] 새로운 소켓을 통해 연결이 되면 데이터를 송수신(send/recv)

[6] 데이터 송수신이 완료되면 소켓을 닫음(close)

![소켓 API 실행 흐름](https://t1.daumcdn.net/cfile/tistory/995C23465C7DD7E30B)



조금 더 구체적으로 알아보자.

### 2. 클라이언트 소켓 프로그래밍

#### 2.1 클라이언트 소켓 생성(socket())

소켓 생성시에 소켓이 사용할 주소 체계, 통신 방식, 프로토콜 등을 설정할 수 있다.

- AF_INET은 address family(주소 체계)가 internet 이라는 뜻이다. IPv4 인터넷 프로토콜을 사용한다.
  - 주소 체계를 나타낼 때는 AF를, 프로토콜 체계를 나타낼 때는 PF를 사용한다고 하는데, 하나의 주소 체계가 여러 개의 프로토콜 체계를 가지진 않아서 AF_INET이나 PF_INET이나 같은 값을 뜻하게 된다. 예를 들어, AF_INET6 주소 체계는 IPv4 인터넷 프로토콜을 지원하고, PF_INET6는 IPv6 인터넷 프로토콜 그 자체를 뜻하는데, 소켓에서 AF_INET6를 사용하면 IPv6 프로토콜을 사용하겠다는 의미이기 때문에 PF_INET6 값을 넣은 것과 다르지 않다고 한다.
  - 결국 그냥 아래 코드처럼 주소 체계에 AF_ 형식을 넣어주면 될 것 같다.

- 통신 방식으로 TCP를 사용한다면 Stream 타입을, UDP를 사용한다면 Datagram 타입을 지정해야 한다.

**프로젝트 코드**

 ```python
 self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
 ```

UDP 연결을 하기 위해 SCOK_DGRAM을 사용하였음



>**공식문서**
>
>```
>socket.socket(family=AF_INET, type=SOCK_STREAM, proto=0, fileno=None)
>```
>
>지정된 주소 패밀리, 소켓 유형, 및 프로토콜 번호를 사용하여 새로운 소켓을 만듭니다. 주소 패밀리는 [`AF_INET`](https://docs.python.org/ko/3/library/socket.html#socket.AF_INET) (기본값), [`AF_INET6`](https://docs.python.org/ko/3/library/socket.html#socket.AF_INET6), [`AF_UNIX`](https://docs.python.org/ko/3/library/socket.html#socket.AF_UNIX), [`AF_CAN`](https://docs.python.org/ko/3/library/socket.html#socket.AF_CAN), [`AF_PACKET`](https://docs.python.org/ko/3/library/socket.html#socket.AF_PACKET) 또는 [`AF_RDS`](https://docs.python.org/ko/3/library/socket.html#socket.AF_RDS) 여야 합니다. 소켓 유형은 [`SOCK_STREAM`](https://docs.python.org/ko/3/library/socket.html#socket.SOCK_STREAM) (기본값), [`SOCK_DGRAM`](https://docs.python.org/ko/3/library/socket.html#socket.SOCK_DGRAM), [`SOCK_RAW`](https://docs.python.org/ko/3/library/socket.html#socket.SOCK_RAW) 또는 기타 `SOCK_` 상수 중 하나여야 합니다. 프로토콜 번호는 일반적으로 0이며 생략될 수도 있고, 주소 패밀리가 [`AF_CAN`](https://docs.python.org/ko/3/library/socket.html#socket.AF_CAN) 일 때 프로토콜은 `CAN_RAW`, [`CAN_BCM`](https://docs.python.org/ko/3/library/socket.html#socket.CAN_BCM), [`CAN_ISOTP`](https://docs.python.org/ko/3/library/socket.html#socket.CAN_ISOTP) 또는 [`CAN_J1939`](https://docs.python.org/ko/3/library/socket.html#socket.CAN_J1939) 중 하나여야 합니다.
>
>*fileno*를 지정하면, *family*, *type* 및 *proto* 값이 지정된 파일 기술자에서 자동 감지됩니다. 명시적 *family*, *type* 또는 *proto* 인자를 사용하여 함수를 호출하면 자동 감지가 무효화 될 수 있습니다. 이는 파이썬이 [`socket.getpeername()`](https://docs.python.org/ko/3/library/socket.html#socket.socket.getpeername)의 반환 값을 나타내는 방식에 영향을 미치지만, 실제 OS 자원에는 영향을 주지 않습니다. [`socket.fromfd()`](https://docs.python.org/ko/3/library/socket.html#socket.fromfd)와는 달리, *fileno*는 복제본이 아니라 같은 소켓을 반환합니다. 이렇게 하면 [`socket.close()`](https://docs.python.org/ko/3/library/socket.html#socket.close)를 사용하여 분리된 소켓을 닫을 수 있습니다.
>
>새로 만들어진 소켓은 [상속 불가능](https://docs.python.org/ko/3/library/os.html#fd-inheritance)합니다.



#### 2.2 연결 요청(connect())

connect()는 IP주소와 포트 번호로 식별되는 대상에게 연결 요청을 보낸다. 연결 요청에 대한 결과가 결정되면 connect()의 실행이 끝난다.

```python
# create an INET, STREAMing socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# now connect to the web server on port 80 - the normal http port
s.connect(("www.python.org", 80))
```



#### 2.3 데이터 송수신(send() / recv())

send()는 소켓을 통해 데이터를 보낼 때, recv()는 데이터를 수신할 때 사용한다. 둘 모두 API 실행 결과가 결정되기 전까지는 종료되지 않기 때문에 이에 주의해야 한다.

- send()의 경우 데이터를 보내는 주체가 자기 자신으로, 얼마만큼의 데이터를 보낼 것인지, 언제 보낼 것인지 알 수 있다.

- recv()는 데이터를 수신하는 입장이기 때문에 API가 한 번 실행되면 언제 끝날지 모른다. (언제 데이터를 수신할지 모름)

따라서 데이터 수신을 위한 recv()는 별도의 스레드를 만들어 실행한다. 소켓의 생성과 연결이 완료된 후, 새로운 스레드를 하나 만들어 그곳에서 recv()를 실행하고 데이터가 수신되기를 기다린다.



#### 2.4 소켓 닫기(close())

더 이상 데이터 송수신이 필요 없게 되면, 소켓을 닫는 close() 를 호출한다.

소켓 연결이 종료된 후 또 다시 데이터를 주고받으려면 소켓 생성과 연결을 다시 해야한다.





### 3. 서버 소켓 프로그래밍

#### 3.1 서버 소켓 생성(socket())

클라이언트 소켓 생성과 동일하다.



#### 3.2 서버 소켓 바인딩(bind())

bind() 에는 소켓과 포트 번호 혹은 **IP주소(=소켓)와 포트 번호**를 인자로 받는다. 즉, 소켓과 포트 번호를 결합한다. 

왜 이런 과정을 거치냐면, 네트워크 관련 기능을 수행하는 다른 프로세스(프로그램)가 소켓 통신을 하고, TCP 또는 UDP 프로토콜을 사용한다면, TCP 표준 또는 UDP 표준에 따라 각 소켓이 하나의 포트 번호(0 ~ 65535 사이의 번호)를 사용하게 된다. 만약 모든 소켓이 동일한 포트 번호를 사용하게 된다면 해당 포트 번호로 데이터가 수신될 때, 어떤 소켓이 이를 처리해야 할지 결정할 수 없는 문제가 발생한다.

따라서 운영체제에서는 소켓들이 중복된 포트 번호를 사용하지 않도록 내부적으로 포트 번호와 소켓 연결 정보를 관리한다. bind()는 해당 소켓이 지정된 포트 번호를 사용할 것이라는 것을 운영체제에 요청하는 API이고, 만약 지정된 포트 번호를 다른 소켓이 사용하고 있다면 bind()는 에러를 리턴한다.

**프로젝트 코드**

```python
recv_address = (self.ip,self.port)
self.sock.bind(recv_address)
```



#### 3.3 클라이언트 연결 요청 대기(listen())

서버 소켓에 포트 번호를 결합하고 나면 서버 소켓은 클라이언트의 연결 요청을 받아들일 준비가 된 것이고, 이제 연결 요청을 기다려야 한다.

listen()의 리턴 값은 연결 요청이 수신 되었는지 여부인 SUCCESS와 FAIL의 정보만을 알려준다.

클라이언트의 연결 요청에 대한 정보는 listen과는 무관하게 시스템 내부적으로 관리되는 큐에 쌓이게 되고, 이러한 요청을 큐로부터 꺼내와서 연결을 완료하기 위해서는 accept() 를 호출해야 한다.



#### 3.4 클라이언트 연결 수립(accept())

accept()로 연결되는 소켓은 서버 소켓이 아니라 새로운 소켓이라고 앞서 이야기하였다. 클라이언트 소켓과 연결되는 소켓은 accept API의 내부에서 만들어지는 새로운 소켓이고, 서버 소켓은 클라이언트의 연결 요청을 수신하는 역할만을 한다.



#### 3.5 데이터 송수신(send() / recv())

클라이언트와 동일



#### 3.6 소켓 연결 종료(close())

서버 소켓에서 close()의 대상은 하나가 아니다. 최초에 생성한 서버 소켓과 accept로 생성한 소켓의 두 가지가 있고, 둘 모두 관리해야 한다.