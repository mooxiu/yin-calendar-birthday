"use client";

import { useState } from "react";
const {Solar, Lunar} = require('lunar-javascript')

export default function Home() {
  const [solar, setSolar] = useState("");
  const [lunar, setLunar] = useState("");
  const [result, setResult] = useState("");

  function computeBirthday() {
    if (!solar && !lunar) {
      setResult("Please enter either a Solar date or a Lunar date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisYear = today.getFullYear();

    let lunarMonth: number;
    let lunarDay: number;

    //
    // 情况 1：用户填阳历，但这个人实际上是按农历过生日 → 先将这个阳历转换成农历（取月/日）
    //
    if (solar) {
      const [y, m, d] = solar.split("-").map(Number);
      const solarObj = Solar.fromYmd(y, m, d);
      const lunarObj = solarObj.getLunar();

      lunarMonth = lunarObj.getMonth();
      lunarDay = lunarObj.getDay();
    } else {
      //
      // 情况 2：用户直接填农历
      //
      const [y, m, d] = lunar.split("-").map(Number);
      lunarMonth = m;
      lunarDay = d;
    }

    //
    // 给定农历月/日 → 找今年/明年对应的阳历生日
    //
    function nextSolarBirthday(lMonth: number, lDay: number): Date {
      // 今年
      const lunarThisYear = Lunar.fromYmd(thisYear, lMonth, lDay);
      const solarThisYear = lunarThisYear.getSolar();
      const dateThisYear = new Date(
        solarThisYear.getYear(),
        solarThisYear.getMonth() - 1,
        solarThisYear.getDay()
      );
      dateThisYear.setHours(0, 0, 0, 0);

      if (dateThisYear >= today) return dateThisYear;

      // 明年
      const lunarNextYear = Lunar.fromYmd(thisYear + 1, lMonth, lDay);
      const solarNextYear = lunarNextYear.getSolar();
      const dateNextYear = new Date(
        solarNextYear.getYear(),
        solarNextYear.getMonth() - 1,
        solarNextYear.getDay()
      );
      dateNextYear.setHours(0, 0, 0, 0);

      return dateNextYear;
    }

    const next = nextSolarBirthday(lunarMonth!, lunarDay!);
    const formatted = next.toISOString().split("T")[0];

    setResult(`Next birthday (Solar): ${formatted}`);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Compute Birthday for Lunar (Yin Calendar) Celebrators
      </h1>

      <p style={styles.desc}>
        The person celebrates via Lunar date every year.
        <br />
        You can enter **either**:
        <br />• A known Solar birthday (from any past year)
        <br />• A Lunar birthday (any year; only month/day will be used)
      </p>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Known Solar Birthday</label>
        <input
          type="date"
          value={solar}
          onChange={(e) => {
            setSolar(e.target.value);
            setLunar("");
            setResult("");
          }}
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Lunar Birthday</label>
        <input
          type="date"
          value={lunar}
          onChange={(e) => {
            setLunar(e.target.value);
            setSolar("");
            setResult("");
          }}
          style={styles.input}
        />
      </div>

      <button onClick={computeBirthday} style={styles.button}>
        Compute
      </button>

      {result && <p style={styles.result}>{result}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "sans-serif",
    maxWidth: "450px",
    margin: "auto",
    lineHeight: 1.6,
  },
  title: {
    fontSize: "22px",
    marginBottom: "20px",
    fontWeight: 600,
  },
  desc: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "28px",
  },
  inputGroup: {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column" as const,
  },
  label: {
    marginBottom: "6px",
    fontSize: "15px",
    fontWeight: 500,
  },
  input: {
    padding: "10px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontWeight: 600,
  },
  result: {
    marginTop: "28px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center" as const,
  },
};