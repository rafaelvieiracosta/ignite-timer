import { useEffect, useContext } from "react";

import { CountdownContainer, Separator } from "./styles";

import { differenceInSeconds } from "date-fns";

import { CyclesContext } from "../..";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    resetActiveCycleId,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          clearInterval(interval);
          setSecondsPassed(0);
          resetActiveCycleId();
          setDocumentTitle(`Ignite Timer`);
          return;
        }

        setSecondsPassed(secondsDifference);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    resetActiveCycleId,
    setSecondsPassed,
  ]);

  function setDocumentTitle(title: string) {
    document.title = title;
  }

  const currentSeconds = totalSeconds - amountSecondsPassed;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      setDocumentTitle(`${minutes}:${seconds}`);
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>

      <Separator>:</Separator>

      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
