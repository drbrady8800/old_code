# Player Library Starter Kit
**INSERT DESCRIPTION OF PROJECT**

Built-in JW Player setup, LESS, Hook.

**INSERT LINK TO YOUR LIVE PROTOTYPE [HERE]()**.

## Create Your Project

1. Make a copy of the this project in the `prototypes/` folder of the JW Sandbox.
2. Rename it to reflect the title of your prototype and navigate to your new project.

## Run Locally

#### 1. Install Dependencies

```
npm install
```

#### 2. Update Sites Commons
[JW Player Sites Commons](https://github.com/jwplayer/jw-sites-commons) is already included as a submodule and referenced in your master Less file. To ensure you're working with the latest version, run:
```
git submodule update --remote --merge
```

#### 3. Build & Watch for Changes
Run `grunt` to initialize the first build of your project, then run the following commands concurrently to serve & watch for changes at [localhost:8080](http://localhost:8080):
```
grunt server
```
and in a separate window:
```
grunt watch
```

## Deploy to Design
To showcase your prototype on a shareable link on [design.jwplayer.com](https://design.jwplayer.com), you'll need to create a production-ready bundle of your app.

#### 1. Create Build
To create a `/build` folder:
```
grunt
```
#### 2. Copy to Design Repo
* Create a feature branch in the [design.jwplayer repo](https://github.com/jwplayer/jwdesign)
* Make a copy of your `/build` folder and paste it under the `/prototype` folder in the design repo & rename it to reflect your project
* Follow instructions for adding a prototype in the [design repo](https://github.com/jwplayer/jwdesign) README.md
