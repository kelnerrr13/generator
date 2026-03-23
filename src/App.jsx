import { useState, useEffect } from "react";
import { Input, Row, Col, Button } from "antd";
import { message } from "antd";

const { TextArea } = Input;

function encrypt(text, key = "my-secret-key") {
  const textBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key);

  const encrypted = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  let binary = "";
  encrypted.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decrypt(encryptedBase64, key = "my-secret-key") {
  const binaryStr = atob(encryptedBase64);

  const encryptedBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    encryptedBytes[i] = binaryStr.charCodeAt(i);
  }

  const keyBytes = new TextEncoder().encode(key);

  const decryptedBytes = new Uint8Array(encryptedBytes.length);
  for (let i = 0; i < encryptedBytes.length; i++) {
    decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return new TextDecoder().decode(decryptedBytes);
}

const url =
  "https://raw.githubusercontent.com/kelnerrr13/license/main/license.txt";

function App() {
  const [area1Text, setArea1Text] = useState("");
  const [area2Text, setArea2Text] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(url);
      const text = await res.text();
      setArea1Text(text);
      setArea2Text(decrypt(text));
    })();
  }, []);

  const handleArea2Change = (e) => {
    const raw = e.target.value;
    setArea2Text(raw);
    setArea1Text(encrypt(raw));
  };

  return (
    <div className="main">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <TextArea
            value={area1Text}
            readOnly
            autoSize={{ minRows: 8, maxRows: 16 }}
            style={{ width: "801px" }}
            rows={8}
            placeholder="Лицензия"
          />
        </Col>
        <Col span={12}>
          <TextArea
            value={area2Text}
            onChange={handleArea2Change}
            autoSize={{ minRows: 8, maxRows: 16 }}
            style={{ width: "100%" }}
            rows={8}
            placeholder="Пользователи"
          />
        </Col>
      </Row>
      <br></br>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(area1Text).then(() => {
            message.success("Лицензия скопирована в буфер обмена");
          });
        }}
      >
        Скопировать
      </Button>
    </div>
  );
}

export default App;
