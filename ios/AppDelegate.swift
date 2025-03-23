import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import React


@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    FirebaseApp.configure()
    
    self.moduleName = "NaviHomeClient"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]
     
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func application(_ application: UIApplication,
                            supportedInterfaceOrientationsFor window: UIWindow?)
  -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }

  override func sourceURL(for bridge: RCTBridge!) -> URL! {
    return self.bundleURL()
  }

  override func bundleURL() -> URL! {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
