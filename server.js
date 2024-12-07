// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// 评论存储的文本文件
const filename = path.join(__dirname, 'comment.txt');

// 获取所有评论
app.get('/api/comments', (req, res) => {
  if (fs.existsSync(filename)) {
    const fileContent = fs.readFileSync(filename, 'utf8').trim();
    if (fileContent) {
      const comments = fileContent.split('\n').map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      }).filter(c => c !== null);
      return res.json(comments);
    }
  }
  res.json([]);
});

// 提交新评论
app.post('/api/comments', (req, res) => {
  const { author, text, isBroadcaster } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Comment text required' });
  }

  const newComment = {
    author: author || '匿名',
    text: text,
    isBroadcaster: !!isBroadcaster
  };

  // 将评论对象转换为JSON字符串，每条评论一行
  fs.appendFileSync(filename, JSON.stringify(newComment) + '\n', 'utf8');

  res.json({ success: true });
});

// 提供静态文件访问（可访问comment.html）
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
