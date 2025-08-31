const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    receiver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    roomId: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }
);

// 채팅방 ID 생성을 위한 인덱스
chatSchema.index({ roomId: 1, createdAt: -1 });
chatSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model('Chat', chatSchema);