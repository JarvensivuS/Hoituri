// styles.js
import { StyleSheet } from "react-native";

const STATUSBAR_COLOR = "#6200EE"; // StatusBar color is blue

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: STATUSBAR_COLOR,
  },
  statusBar: {
    backgroundColor: STATUSBAR_COLOR,
  },
  topNav: {
    height: 60,
    backgroundColor: STATUSBAR_COLOR,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  forwardButton: {
    position: "absolute",
    right: 15,
  },
  navText: {
    color: "white",
    fontSize: 18,
  },
  titleText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  screenContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  ScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  ScreenText: {
    fontSize: 18,
    color: "#333",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },

  // LocationScreen-tyylit
  locationScreenContainer: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  mapContainer: {
    flex: 1,
    width: "100%",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
  bottomContainer: {
    padding: 10,
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
  },
  warningText: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center", marginBottom: 5
 },
});

export default styles;
