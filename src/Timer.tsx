import React from "react";
import TimerStatic from "./TimerStatic";
import { useCookies } from "react-cookie";

function Timer(props: {
  max_secs: number;
  timerRunning: boolean;
  contestName: string;
  turnOffTimer: () => void;
  cleared: boolean;
}) {
  const [cookies, setCookies] = useCookies();
  const { max_secs, timerRunning, contestName, turnOffTimer, cleared } = props;
  const [secs, setSecs] = React.useState<number>(
    cookies.hasOwnProperty(`${contestName}-time`)
      ? Math.min(
          Math.floor(
            (new Date().getTime() - cookies[`${contestName}-time`]) / 1000
          ),
          max_secs
        )
      : 0
  );

  // React.useEffect(() => {
  //   if (secs !== 0) {
  //     setCookies(`${contestName}-time`, secs, { path: '/' })
  //   }
  // }, [secs, setCookies, contestName]);
  React.useEffect(() => {
    if (!timerRunning && cleared) {
      setSecs(0);
    }
  }, [cleared]);

  React.useEffect(() => {
    if (timerRunning) {
      // console.log(timerRunning);
      var startTime = new Date().getTime();
      // console.log(
      //   cookies[`${contestName}-time-stop`],
      //   cookies[`${contestName}-time`]
      // );
      // if (cookies.hasOwnProperty(`${contestName}-time-stop`)) {
      //   startTime =
      //     startTime -
      //     (cookies[`${contestName}-time-stop`] -
      //       cookies[`${contestName}-time`]);
      // } else
      if (cookies.hasOwnProperty(`${contestName}-time`)) {
        startTime = cookies[`${contestName}-time`];
      } else {
        setCookies(`${contestName}-time`, startTime, { path: "/" });
      }
      // console.log(startTime);
      // if (cookies.hasOwnProperty(`${contestName}-time`)) {
      //   setSecs(cookies[`${contestName}-time`]);
      // } else {
      setSecs(Math.floor((new Date().getTime() - startTime) / 1000));
      // }
      const timer = setInterval(() => {
        var secs = Math.floor((new Date().getTime() - startTime) / 1000);
        // console.log(secs);
        // console.log(timerRunning);
        if (!timerRunning || secs > max_secs) {
          // clearInterval(timer);
          turnOffTimer();
          if (secs > max_secs) {
            setSecs(max_secs);
          }
        } else {
          setSecs(secs);
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    } else {
      // console.log(timerRunning);
    }
  }, [max_secs, timerRunning, contestName, setCookies, turnOffTimer]);

  return <TimerStatic max_secs={max_secs} secs={secs} />;
}

export default Timer;
