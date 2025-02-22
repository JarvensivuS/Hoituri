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

  safeArea: {
    flex:1,
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },

  // Screen styles
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
  map: {
    width: "100%",
    height: "80%",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  
});


export default styles;
