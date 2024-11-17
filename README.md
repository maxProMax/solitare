https://r3f.docs.pmnd.rs/getting-started/introduction

push docker container

https://docs.docker.com/get-started/introduction/build-and-push-first-image/

https://www.digitalocean.com/community/tutorials/how-to-use-the-docker-1-click-install-on-digitalocean

https://docs.docker.com/guides/nodejs/containerize/

build image
$ docker build --platform linux/amd64 -t USER/REPO .

login to docker in dashboard

push

$ docker push USER/REPO

In server

$ docker pull

run

$ docker run -d -p 80:3000 USER/REPO
