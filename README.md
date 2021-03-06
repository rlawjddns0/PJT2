## IoT제어 프로젝트



## SSAVIS : 내 일을 손쉽게 도울 스마트홈 서비스

:white_check_mark: 주요기능

- 청소 / 가전 제어 / 분실물 확인 및 찾기 / 침입 확인 및 기록
- 모드 설정 - 4가지 기존 모드 제공 및 커스터마이징(수정 및 추가)
- 음성 인식 - STT(Speech-To-Text) API 활용, 음성인식을 통한 제어
- 푸시 알림 (청소 완료, 분실물 확인, 칩입자 인식)

:white_check_mark: ​ 팀원 역할

* 이수정(팀장) : FE(UI/UX), 사물 인식 담당
* 배현우(팀원) : FE 담당, 제어 담당
* 김정운(팀원) : BE 담당, 자율주행 담당
* 유성호(팀원) : BE , 자율주행 담당

:hammer_and_wrench: 기술 스택

* Front-End : React Native, Firebase
* Back-End : Node.js , MySQL
* 통신 :  Socket.IO
* 인지/판단/제어 : OpenCV, Tensorflow,  ROS2
* Deploy : AWS EC2, Nginx, Jenkins, Docker

:white_check_mark: Git 컨벤션

- Sub 1 (Week 1) 은 자신의 이름으로 branch를 만들어 커밋합니다.
- Sub 2, Sub 3는 develop branch에 커밋/푸시/머지해야 하며,

각자 로컬 브랜치로 feature 브랜치를 만들어 작업합니다.

- 커밋 시 **Jira 이슈번호 + 작업분류 + 작업내용**

ex. S05P21B202-28 [feat] 오후 sub1 명세서 학습

:recycle: Jira 작업 분류

- feat : 새로운 기능 추가
- fix : 버그 수정
- docs : 문서 수정
- style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- refactor : 코드 리펙토링
- test : 테스트 코드, 리펙토링 테스트 코드 추가
- chore : 빌드 업무 수정, 패키지 매니저 수정

:white_check_mark: 와이어프레임

[와이어프레임](https://www.figma.com/file/iYeLmY0nTDgfWH4C606YBN/SSAVIS?node-id=0%3A1 "와이어프레임")

:date: 간츠 차트

![간츠차트](/uploads/0230f8b0b6eeea1fdb07785ab6f3e0d7/간츠차트.png)

:bank: ​다이어그램

![diagram](/uploads/5a057db8e1a108b78de487bd7ee47706/diagram.JPG)

* 포팅 매뉴얼
  - https://www.notion.so/e442d7d78d4d485eb27e8dd6a18f6dc6

* 시연 동영상
  1. 가전제어

     ![가전제어](README.assets/가전제어.gif)

  2. 침입 관리

     ![침입확인](README.assets/침입확인.gif)

  3. 분실물 관리

     ![사물인식(1)](README.assets/사물인식(1).gif)

  4. 청소

     ![전체청소](README.assets/전체청소.gif)





[UCC 링크](https://drive.google.com/file/d/1f27RoF6yLidbldMMoYDzPb3-xSRdz99s/view)

