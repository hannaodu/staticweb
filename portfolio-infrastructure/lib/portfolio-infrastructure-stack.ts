import * as cdk from "aws-cdk-lib";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import { verify } from "crypto";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PortfolioInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //amplify Application
    const amplifyApp = new amplify.App(this, "PortfolioApplication", {
      appName: "Portfolio",
      //connect to my git hub
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "hannaodu",
        repository: "portfolio",
        oauthToken: cdk.SecretValue.secretsManager("github-token"),
      }),

      //build specification
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: "1.0",
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'echo "starting this build"',
                
                'npm install',
              ],
            },
            build: {
              commands: [
                'echo "building my nextjs app.." ',
                'npm run build',
                'echo "build is completed"',
              ],
            },
          },
          artifacts: {
            baseDirectory: "portfolio/out", 
            files: ["**/*"],
          },
          cache: {
            paths: ["node_modules/**/*", "portfolio/out/**/*"],
          },
        },
      }),
    });
    const mainBranch = amplifyApp.addBranch("main", {
      autoBuild: true,
    });
  }
}
