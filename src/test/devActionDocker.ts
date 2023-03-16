import { assert, expect } from 'chai';
import { time } from 'console';
import * as fs from 'fs';
import { WebDriver,BottomBarPanel,SideBarView, ActivityBar, ViewItem, ViewSection, ViewControl, VSBrowser } from 'vscode-extension-tester';
import * as utils from './utils/testUtils';
import { SERVER_START_STRING, SERVER_STOP_STRING,SERVER_STOP_DOCKER_STRING } from './definitions/constants';

describe('Open Project', () => {

    let driver: WebDriver;


    before(() => {
        driver = VSBrowser.instance.driver;

    });

    it('Open Sample Project', async () => {
        await VSBrowser.instance.openResources(utils.getMvnProjectPath());

    }).timeout(10000);


});

describe('Section', () => {
    let sidebar: SideBarView;
    let section: ViewSection;
    let menu: ViewItem[];

    before(() => {
        sidebar = new SideBarView();


    });

it('getViewControl works with the correct label',  async() => {

   const contentPart = sidebar.getContent();
   section = await contentPart.getSection('Liberty Dashboard');
   console.log("Found Liberty Dashboard....");
   expect(section).not.undefined;

}).timeout(10000);


it('openDasboard shows items', async () => {


    await utils.delay(60000);
    console.log("before getVisibleItems");
    const menu = await section.getVisibleItems();
    console.log("after getvisibleitems");
    expect(menu).not.empty;


}).timeout(160000);


it('start with docker from liberty dashboard', async () => {

//  console.log("b4 launchStartServerWithDocker");
  await utils.launchStartServerWithDocker(section);
  //  console.log("after launchStartServerWithDocker");
  await utils.delay(60000);
  const serverStartStatus = await utils.checkTerminalforServerState(SERVER_START_STRING);
  //console.log("after checkTerminalforServerState ");
  if(!serverStartStatus)
    console.log("Server started message not found in the logs");
  else
  {
    console.log("Server succuessfully started");
    await utils.launchStopServer(section);
    const serverStopStatus= await utils.checkTerminalforServerState(SERVER_STOP_DOCKER_STRING);
    if(!serverStopStatus){
    console.error("Server stopped message not found in the logs");
    }
    else
      console.log("Server stopped successfully");
    expect (serverStopStatus).to.be.true;
}
 expect (serverStartStatus).to.be.true;


}).timeout(350000);



});
