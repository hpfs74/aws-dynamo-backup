pipeline {
    agent { label "${env.BUILD_SLAVE}" }
    environment {
      SERVICE_NAME = 'aws-dynamodb-backup'
      RELEASE_FOLDER = 'insurances/aws-dynamodb-backup/releases'
      ARTIFACT_FOLDER = 'insurances/aws-dynamodb-backup/artifacts'
      ARTIFACT_BUCKET = 'knab-artifact-bucket-mgmt'
      AWS_S3_CREDENTIALS = 'jenkins-artifact-s3'
      AWS_S3_REGION = 'eu-west-1'
      NODEJS_HOME = "${tool 'node'}"
      PATH="${NODEJS_HOME}/bin:${PATH}"
    }
    tools {
        nodejs 'node'
    }

    stages {
        stage("Checkout source") {
            steps
            {
                dir('code')
                {
                    git branch: 'master', credentialsId: 'bitbucket-jenkins', url: "git@bitbucket.org:knabab/aws-dynamodb-backup.git"
                }
                dir('scripts')
                {
                    git branch: 'master', credentialsId: 'bitbucket-jenkins', url: "git@bitbucket.org:knabab/knab-jenkins-scripts.git"
                }
            }
        }

        stage('install') {
            steps {
                dir('code')
                {
                    sh 'npm --version'
                    sh 'npm install'
                }
            }
        }

        stage('test') {
            steps {
                dir('code')
                {
                    sh 'npm run lint'
                    sh 'npm run test'
                }
            }
        }

        stage('Archive') {
            steps {
                dir('code')
                {
                    sh 'mkdir -p ./output'
                    sh 'cp -aR src/*.js node_modules ./output'
                    zip dir: './output', glob: '*.js,node_modules/', zipFile: "../artifact/lambda.zip"
                    sh 'rm -rf ./output'
                }
            }
        }

        stage('Archive artifacts') {
            steps
            {
                dir ("artifact")
                {
                    s3Upload(file:"lambda.zip", bucket:"${ARTIFACT_BUCKET}", path:"${ARTIFACT_FOLDER}/${SERVICE_NAME}-${BUILD_NUMBER}.zip")
                }
            }
        }
        stage('Run versioning') {
            steps
            {
                dir ('scripts')
                {
                    sh 'chmod u+x ./jenkins/update_software_release_file.sh'
                    withAWS(credentials: "${AWS_S3_CREDENTIALS}", region: "${AWS_S3_REGION}")
                    {
                        sh "BUILD_NUMBER=\"${BUILD_NUMBER}\" RELEASE_FOLDER=\"${RELEASE_FOLDER}\" ./jenkins/update_software_release_file.sh"
                    }
                }
            }
        }
    }
}
