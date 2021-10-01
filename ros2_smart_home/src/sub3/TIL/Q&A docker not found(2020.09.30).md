# 질문



## 1. docker:not found

- jenkins 접속 가능 http://j5b202.p.ssafy.io:9080/

- feature/김정운/BE 로 push 하면 jenkins에서 실행 됨

- **jenkins Execute shell**

  ```
  cd /var/jenkins_home/workspace/kjw/Backend
  npm install
  
  docker build . -t backend-kjw   <-- ERROR 발생 지점?
  
  docker stop backend-kjw
  
  docker rm backend-kjw
  
  docker run -d -p 8080:8080 --name backend-kjw backend-kjw
  ```

- docker:not found 에러 메시지 발생 (npm install 까지 되는걸로 보임)

  ```
  Started by GitLab push by 김정운
  Running as SYSTEM
  Building in workspace /var/jenkins_home/workspace/kjw
  The recommended git tool is: NONE
  using credential kjw
   > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/kjw/.git # timeout=10
  Fetching changes from the remote Git repository
   > git config remote.origin.url https://lab.ssafy.com/s05-iot-ctrl/S05P21B202 # timeout=10
  Fetching upstream changes from https://lab.ssafy.com/s05-iot-ctrl/S05P21B202
   > git --version # timeout=10
   > git --version # 'git version 2.30.2'
  using GIT_ASKPASS to set credentials 
   > git fetch --tags --force --progress -- https://lab.ssafy.com/s05-iot-ctrl/S05P21B202 +refs/heads/*:refs/remotes/origin/* # timeout=10
  skipping resolution of commit remotes/origin/feature/김정운/BE, since it originates from another repository
   > git rev-parse refs/remotes/origin/feature/김정운/BE^{commit} # timeout=10
  Checking out Revision ad1d0fc2dbc367da202334b5e67a4f3a58c79cd8 (refs/remotes/origin/feature/김정운/BE)
   > git config core.sparsecheckout # timeout=10
   > git checkout -f ad1d0fc2dbc367da202334b5e67a4f3a58c79cd8 # timeout=10
  Commit message: "asdf"
   > git rev-list --no-walk 4bf1a9acce079fcddf98aceb65d2a60183535976 # timeout=10
  [kjw] $ /bin/sh -xe /tmp/jenkins14277813651138742059.sh
  + cd /var/jenkins_home/workspace/kjw/Backend
  + npm install
  
  up to date, audited 850 packages in 5s
  
  27 vulnerabilities (3 low, 5 moderate, 14 high, 5 critical)
  
  To address issues that do not require attention, run:
    npm audit fix
  
  To address all issues (including breaking changes), run:
    npm audit fix --force
  
  Run `npm audit` for details.
  + docker build . -t backend-kjw
  /tmp/jenkins14277813651138742059.sh: 6: docker: not found
  Build step 'Execute shell' marked build as failure
  Finished: FAILURE
  ```

- **docker-compose.yml**

  ```
  version: '3.3'
  services:
          jenkins:
                  restart: always
                  container_name: jenkins
                  image: jenkins/jenkins
                  ports:
                          - "9080:8080"
                  volumes:
                          - "/var/run/docker.sock:/var/run/docker.sock ubuntu/jenkins_home"
                          - "./jenkins_home:/var/jenkins_home"
  
  ```

- **Dockerfile**

  ```dockerfile
  #어떤 이미지로부터 새로운 이미지를 생성할지를 지정
  FROM node:14.17.3
  
  #Dockerfile 을 생성/관리하는 사람
  MAINTAINER KIM JEONGWOON <rlawjddns@naver.com>
  
  # /app 디렉토리 생성
  RUN mkdir -p /app
  # /app 디렉토리를 WORKDIR 로 설정
  WORKDIR /app
  # 현재 Dockerfile 있는 경로의 모든 파일을 /app 에 복사
  ADD . /app
  # npm install 을 실행
  RUN npm install
  
  
  #환경변수 NODE_ENV 의 값을 development 로 설정
  ENV NODE_ENV development
  
  
  #가상 머신에 오픈할 포트
  EXPOSE 80 3000
  #컨테이너에서 실행될 명령을 지정
  CMD ["npm","start"]
  ```

  




## 2. Error: connect ECONNREFUSSED 127.0.0.1:3306

- docker build를 하기 전에 npm start가 되는지 확인해보려고 함

- **Jenkins Execute Shell**

  ```
  cd /var/jenkins_home/workspace/kjw/Backend
  npm install
  npm start
  ```

- 위와 같이 작성 후 gitlab에 푸시 결과 `Error: connect ECONNREFUSSED 127.0.0.1:3306` 발생

- 서버에서 mysql 실행 중인 상태

- :~/jenkins_home/workspace/kjw/Backend/server/config/DBconfig.js

  ```js
  const mysql = require('mysql');
  var DB = mysql.createConnection({
      host     : 'localhost',
      user     : 'kjw',
      password : '1q2w3e4r1!',
      database : 'ssafy_app_db'
  });
  
  DB.connect()
  
  module.exports=DB;
  ```



*서버에서 직접 npm start 하면 에러는 뜨지 않으나 젠킨스 통해서 npm start 하면 아래 에러가 뜬다.

![Image Pasted at 2021-9-30 02-29](C:\Users\multicampus\Desktop\Image Pasted at 2021-9-30 02-29.png)







둘 다 같은 이유에서 발생

- 도커에 현재 젠킨스만 컨테이너 형식으로 깔아 놨는데, 지금 스크립트나 shell 실행에 필요한 docker와 mysql이 도커 내부에는 없기 때문에 생긴 문제였음

- 서버 자체에는 도커, mysql이 깔려있고, 도커 내부에 jenkins가 관리되고 있었는데, 도커 내부는 별개의 환경이라 도커와 mysql이 잡히지 않음

해결책

- 1. 도커 내부에 도커와 mysql을 설치하여 컨테이너로 관리한다.

- 2. 도커 외부에서 jenkins.war 를 깔아서 도커 내부가 아니라 외부에서 사용한다.

     https://www.jenkins.io/download/

     jenkins war 서버에 설치 후 폴더에 들어가서 java -jar jenkins.war

