#!groovy​

def app
def imageName="content-first"
def imageLabel=BUILD_NUMBER

pipeline {
    agent {
        label 'devel9-head'
    }
    environment {
        DOCKER_TAG = "${imageName}-${imageLabel}"
        GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
    }
    stages {

        stage('Build image') {
            steps { script {
                // Work around bug https://issues.jenkins-ci.org/browse/JENKINS-44609 , https://issues.jenkins-ci.org/browse/JENKINS-44789
                sh "docker build -t $imageName:${imageLabel} --pull --no-cache ."
                app = docker.image("$imageName:${imageLabel}")
            } }
        }

        stage('Integration test') {
            steps {
                script {
                    ansiColor("xterm") {
                        sh "echo Integrating..."
//                        sh "docker-compose build"
//                        sh "IMAGE=${imageName} TAG=${imageLabel} docker-compose run e2e"
                    }
                }
            }
        }
        stage('Push to Artifactory') {
//            when {
//                branch "master"
//            }
            steps {
                script {
                    if (currentBuild.resultIsBetterOrEqualTo('SUCCESS')) {
                        docker.withRegistry('https://docker-ux.dbc.dk', 'docker') {
                            app.push()
                            app.push("latest")
                        }
                    }
                } }
        }
    }
    post {
//        always {
//            sh "docker-compose down -v"
//        }
        failure {
            script {
                if ("${env.BRANCH_NAME}" == 'master') {
                    slackSend(channel: 'fe-drift',
                            color: 'warning',
                            message: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed and needs attention: ${env.BUILD_URL}",
                            tokenCredentialId: 'slack-global-integration-token')
                }
            }
        }
        success {
            script {
                if ("${env.BRANCH_NAME}" == 'master') {
                    slackSend(channel: 'fe-drift',
                            color: 'good',
                            message: "${env.JOB_NAME} #${env.BUILD_NUMBER} completed, and pushed ${DOCKER_TAG} to artifactory.",
                            tokenCredentialId: 'slack-global-integration-token')

                }
            }
        }
        fixed {
            slackSend(channel: 'fe-drift',
                    color: 'good',
                    message: "${env.JOB_NAME} #${env.BUILD_NUMBER} back to normal: ${env.BUILD_URL}",
                    tokenCredentialId: 'slack-global-integration-token')

        }
    }
}