# 📱 API Documentation - Chat/Messaging Feature
## User & Personal Trainer Messaging System

**Version:** 1.0
**Base URL:** `{API_URL}/v1`
**Authentication:** Bearer Token (JWT)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [WebSocket Connection](#websocket-connection)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)

---

## 🔍 Overview

Hệ thống chat cho phép User và Personal Trainer (PT) nhắn tin trực tiếp với nhau. Hỗ trợ:
- ✅ Nhắn tin real-time qua WebSocket
- ✅ Lấy danh sách cuộc hội thoại
- ✅ Lấy lịch sử tin nhắn (phân trang)
- ✅ Đánh dấu đã đọc
- ✅ Đếm số tin nhắn chưa đọc
- ✅ Tạo hoặc lấy cuộc hội thoại

---

## 🔐 Authentication

### Token Requirements
Tất cả các API endpoint yêu cầu **Bearer Token** trong header:

```http
Authorization: Bearer {accessToken}
```

### Token Refresh
Khi token hết hạn (401), client cần gọi API refresh token:

**Endpoint:** `POST /auths/refresh`
**Cookie:** refreshToken (httpOnly)

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔌 WebSocket Connection

### Connection URL
```
ws://{API_URL}/socket.io
```

### Connection Setup
```javascript
import { io } from 'socket.io-client'

const socket = io(API_URL, {
  auth: {
    token: accessToken // Bearer token
  },
  transports: ['websocket', 'polling']
})
```

### Socket Events

#### 📤 Emit Events (Client → Server)

##### 1. Join Conversation Room
```javascript
socket.emit('join-conversation', {
  conversationId: 'string',
  role: 'user' | 'trainer'
})
```

##### 2. Send Message
```javascript
socket.emit('send-message', {
  conversationId: 'string',
  content: 'string',
  role: 'user' | 'trainer'
})
```

##### 3. Mark as Read
```javascript
socket.emit('mark-read', {
  conversationId: 'string',
  messageIds: ['messageId1', 'messageId2'],
  role: 'user' | 'trainer'
})
```

##### 4. Typing Indicator
```javascript
socket.emit('typing', {
  conversationId: 'string',
  role: 'user' | 'trainer'
})

socket.emit('stop-typing', {
  conversationId: 'string',
  role: 'user' | 'trainer'
})
```

#### 📥 Listen Events (Server → Client)

##### 1. New Message Received
```javascript
socket.on('new-message', (message) => {
  // message: Message object
  console.log('New message:', message)
})
```

##### 2. Message Read
```javascript
socket.on('messages-read', (data) => {
  // data: { conversationId, messageIds, readBy }
  console.log('Messages marked as read:', data)
})
```

##### 3. Typing Indicators
```javascript
socket.on('user-typing', (data) => {
  // data: { conversationId, userId, role }
  console.log('User is typing...')
})

socket.on('user-stop-typing', (data) => {
  console.log('User stopped typing')
})
```

##### 4. Connection Events
```javascript
socket.on('connect', () => {
  console.log('Connected to chat server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from chat server')
})

socket.on('error', (error) => {
  console.error('Socket error:', error)
})
```

---

## 📡 API Endpoints

### 1. Get Conversations List

**Lấy danh sách tất cả cuộc hội thoại của user hiện tại**

**Endpoint:** `GET /conversations/{userId}`

**Query Parameters:**
| Parameter | Type   | Required | Default | Description                    |
|-----------|--------|----------|---------|--------------------------------|
| page      | number | No       | 1       | Số trang                       |
| limit     | number | No       | 20      | Số lượng cuộc hội thoại/trang  |
| role      | string | Yes      | -       | 'user' hoặc 'trainer'          |

**Example Request:**
```http
GET /conversations/6750a1b2c3d4e5f6a7b8c9d0?page=1&limit=20&role=user
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "_id": "conv123456",
        "participants": {
          "userId": {
            "_id": "user123",
            "fullName": "Nguyễn Văn A",
            "avatar": "https://example.com/avatar.jpg"
          },
          "trainerId": {
            "_id": "trainer456",
            "fullName": "PT Huấn Luyện Viên",
            "avatar": "https://example.com/trainer-avatar.jpg"
          }
        },
        "lastMessage": {
          "_id": "msg789",
          "content": "Xin chào, tôi muốn đặt lịch tập",
          "sender": "user123",
          "createdAt": "2025-12-12T10:30:00.000Z",
          "isRead": false
        },
        "unreadCount": 3,
        "createdAt": "2025-12-10T08:00:00.000Z",
        "updatedAt": "2025-12-12T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalConversations": 89,
      "limit": 20
    }
  }
}
```

---

### 2. Create or Get Conversation

**Tạo mới hoặc lấy cuộc hội thoại giữa user và trainer**

**Endpoint:** `POST /conversations`

**Request Body:**
```json
{
  "userId": "user123",
  "trainerId": "trainer456",
  "role": "user"
}
```

**Response (200 OK hoặc 201 Created):**
```json
{
  "success": true,
  "message": "Conversation retrieved successfully",
  "data": {
    "_id": "conv123456",
    "participants": {
      "userId": "user123",
      "trainerId": "trainer456"
    },
    "lastMessage": null,
    "unreadCount": 0,
    "createdAt": "2025-12-12T10:00:00.000Z",
    "updatedAt": "2025-12-12T10:00:00.000Z"
  }
}
```

---

### 3. Get Messages in Conversation

**Lấy lịch sử tin nhắn của một cuộc hội thoại (có phân trang)**

**Endpoint:** `GET /conversations/{conversationId}/messages`

**Query Parameters:**
| Parameter       | Type   | Required | Default | Description              |
|-----------------|--------|----------|---------|--------------------------|
| page            | number | No       | 1       | Số trang                 |
| limit           | number | No       | 50      | Số lượng tin nhắn/trang  |
| role            | string | Yes      | -       | 'user' hoặc 'trainer'    |

**Example Request:**
```http
GET /conversations/conv123456/messages?page=1&limit=50&role=user
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "msg001",
        "conversationId": "conv123456",
        "sender": {
          "_id": "user123",
          "fullName": "Nguyễn Văn A",
          "avatar": "https://example.com/avatar.jpg",
          "role": "user"
        },
        "content": "Chào PT, tôi muốn tư vấn chế độ tập",
        "isRead": true,
        "readAt": "2025-12-12T10:35:00.000Z",
        "createdAt": "2025-12-12T10:30:00.000Z",
        "updatedAt": "2025-12-12T10:35:00.000Z"
      },
      {
        "_id": "msg002",
        "conversationId": "conv123456",
        "sender": {
          "_id": "trainer456",
          "fullName": "PT Huấn Luyện Viên",
          "avatar": "https://example.com/trainer-avatar.jpg",
          "role": "trainer"
        },
        "content": "Chào bạn! Tôi sẵn sàng tư vấn cho bạn",
        "isRead": false,
        "readAt": null,
        "createdAt": "2025-12-12T10:33:00.000Z",
        "updatedAt": "2025-12-12T10:33:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalMessages": 127,
      "limit": 50,
      "hasMore": true
    }
  }
}
```

---

### 4. Send Message

**Gửi tin nhắn mới trong cuộc hội thoại**

**Endpoint:** `POST /conversations/{conversationId}/messages`

**Query Parameters:**
| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| role      | string | Yes      | 'user' hoặc 'trainer' |

**Request Body:**
```json
{
  "content": "Tôi muốn đặt lịch tập vào thứ 2 tuần sau"
}
```

**Example Request:**
```http
POST /conversations/conv123456/messages?role=user
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "Tôi muốn đặt lịch tập vào thứ 2 tuần sau"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "msg003",
    "conversationId": "conv123456",
    "sender": {
      "_id": "user123",
      "fullName": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar.jpg",
      "role": "user"
    },
    "content": "Tôi muốn đặt lịch tập vào thứ 2 tuần sau",
    "isRead": false,
    "readAt": null,
    "createdAt": "2025-12-12T11:00:00.000Z",
    "updatedAt": "2025-12-12T11:00:00.000Z"
  }
}
```

**Note:** Tin nhắn cũng sẽ được gửi real-time qua WebSocket event `new-message`

---

### 5. Mark Messages as Read

**Đánh dấu các tin nhắn đã đọc**

**Endpoint:** `PUT /conversations/{conversationId}/messages/read`

**Query Parameters:**
| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| role      | string | Yes      | 'user' hoặc 'trainer' |

**Request Body:**
```json
{
  "messageIds": ["msg001", "msg002", "msg003"]
}
```

**Example Request:**
```http
PUT /conversations/conv123456/messages/read?role=user
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "messageIds": ["msg001", "msg002", "msg003"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Messages marked as read",
  "data": {
    "conversationId": "conv123456",
    "updatedCount": 3,
    "messageIds": ["msg001", "msg002", "msg003"],
    "readAt": "2025-12-12T11:05:00.000Z"
  }
}
```

---

### 6. Get Unread Count

**Lấy tổng số tin nhắn chưa đọc của user hiện tại**

**Endpoint:** `GET /conversations/unread-count`

**Example Request:**
```http
GET /conversations/unread-count
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 12,
    "conversations": [
      {
        "conversationId": "conv123456",
        "unreadCount": 5
      },
      {
        "conversationId": "conv789012",
        "unreadCount": 7
      }
    ]
  }
}
```

---

## 📦 Data Models

### Conversation Model
```typescript
interface Conversation {
  _id: string
  participants: {
    userId: User
    trainerId: Trainer
  }
  lastMessage: Message | null
  unreadCount: number
  createdAt: string
  updatedAt: string
}
```

### Message Model
```typescript
interface Message {
  _id: string
  conversationId: string
  sender: {
    _id: string
    fullName: string
    avatar: string
    role: 'user' | 'trainer'
  }
  content: string
  isRead: boolean
  readAt: string | null
  createdAt: string
  updatedAt: string
}
```

### User Model
```typescript
interface User {
  _id: string
  fullName: string
  avatar: string
  email: string
  phone: string
}
```

### Trainer Model
```typescript
interface Trainer {
  _id: string
  fullName: string
  avatar: string
  email: string
  phone: string
  specialization: string[]
}
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common HTTP Status Codes

| Status Code | Description                                  |
|-------------|----------------------------------------------|
| 200         | OK - Request successful                      |
| 201         | Created - Resource created successfully      |
| 400         | Bad Request - Invalid input data             |
| 401         | Unauthorized - Missing or invalid token      |
| 403         | Forbidden - Insufficient permissions         |
| 404         | Not Found - Resource not found               |
| 500         | Internal Server Error                        |

### Error Examples

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "Please login again"
  }
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Không tìm thấy cuộc hội thoại",
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "details": "Conversation ID: conv123456"
  }
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập cuộc hội thoại này",
  "error": {
    "code": "FORBIDDEN",
    "details": "You are not a participant of this conversation"
  }
}
```

---

## 💻 Code Examples

### React Native / Expo Example

#### Setup API Client
```javascript
// api/chatApi.js
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'https://your-api-domain.com/v1'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await axios.post(`${API_URL}/auths/refresh`, {}, {
          withCredentials: true
        })
        await AsyncStorage.setItem('accessToken', data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        await AsyncStorage.removeItem('accessToken')
        // Navigate to login screen
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

#### Chat API Functions
```javascript
// api/chatApi.js (continued)

export const chatApi = {
  // Get conversations
  getConversations: async (userId, page = 1, limit = 20, role) => {
    const response = await apiClient.get(
      `/conversations/${userId}?page=${page}&limit=${limit}&role=${role}`
    )
    return response.data
  },

  // Create or get conversation
  createOrGetConversation: async (userId, trainerId, role) => {
    const response = await apiClient.post('/conversations', {
      userId,
      trainerId,
      role
    })
    return response.data
  },

  // Get messages
  getMessages: async (conversationId, page = 1, limit = 50, role) => {
    const response = await apiClient.get(
      `/conversations/${conversationId}/messages?page=${page}&limit=${limit}&role=${role}`
    )
    return response.data
  },

  // Send message
  sendMessage: async (conversationId, content, role) => {
    const response = await apiClient.post(
      `/conversations/${conversationId}/messages?role=${role}`,
      { content }
    )
    return response.data
  },

  // Mark as read
  markAsRead: async (conversationId, messageIds, role) => {
    const response = await apiClient.put(
      `/conversations/${conversationId}/messages/read?role=${role}`,
      { messageIds }
    )
    return response.data
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await apiClient.get('/conversations/unread-count')
    return response.data
  }
}
```

#### WebSocket Hook
```javascript
// hooks/useSocket.js
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'https://your-api-domain.com'

export const useSocket = () => {
  const socketRef = useRef(null)

  useEffect(() => {
    const initSocket = async () => {
      const token = await AsyncStorage.getItem('accessToken')

      socketRef.current = io(API_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
      })

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to socket server')
      })

      socketRef.current.on('disconnect', () => {
        console.log('❌ Disconnected from socket server')
      })

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error)
      })
    }

    initSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return socketRef.current
}
```

#### Chat Screen Example
```javascript
// screens/ChatScreen.js
import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, TextInput, Button, Text } from 'react-native'
import { chatApi } from '../api/chatApi'
import { useSocket } from '../hooks/useSocket'

const ChatScreen = ({ route }) => {
  const { conversationId, role, userId } = route.params
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const socket = useSocket()

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true)
      const result = await chatApi.getMessages(conversationId, 1, 50, role)
      setMessages(result.data.messages.reverse())
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }, [conversationId, role])

  // Join conversation room
  useEffect(() => {
    if (socket) {
      socket.emit('join-conversation', { conversationId, role })

      // Listen for new messages
      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message])

        // Mark as read if not sender
        if (message.sender._id !== userId) {
          chatApi.markAsRead(conversationId, [message._id], role)
        }
      })

      // Listen for typing indicators
      socket.on('user-typing', ({ userId: typingUserId }) => {
        if (typingUserId !== userId) {
          // Show typing indicator
        }
      })

      socket.on('user-stop-typing', () => {
        // Hide typing indicator
      })
    }

    return () => {
      if (socket) {
        socket.off('new-message')
        socket.off('user-typing')
        socket.off('user-stop-typing')
      }
    }
  }, [socket, conversationId, role, userId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Send message
  const handleSend = async () => {
    if (!inputText.trim()) return

    try {
      const result = await chatApi.sendMessage(conversationId, inputText, role)
      setMessages(prev => [...prev, result.data])
      setInputText('')

      // Also emit via socket for real-time
      socket.emit('send-message', {
        conversationId,
        content: inputText,
        role
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Typing indicator
  const handleTyping = () => {
    socket.emit('typing', { conversationId, role })

    // Auto stop typing after 3s
    setTimeout(() => {
      socket.emit('stop-typing', { conversationId, role })
    }, 3000)
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{
            padding: 10,
            alignSelf: item.sender._id === userId ? 'flex-end' : 'flex-start',
            backgroundColor: item.sender._id === userId ? '#DCF8C6' : '#E8E8E8',
            borderRadius: 8,
            margin: 5,
            maxWidth: '70%'
          }}>
            <Text>{item.content}</Text>
            <Text style={{ fontSize: 10, color: '#666' }}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15 }}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text)
            handleTyping()
          }}
          placeholder="Nhập tin nhắn..."
        />
        <Button title="Gửi" onPress={handleSend} />
      </View>
    </View>
  )
}

export default ChatScreen
```

#### Conversation List Screen
```javascript
// screens/ConversationsScreen.js
import React, { useState, useEffect } from 'react'
import { View, FlatList, TouchableOpacity, Text, Image } from 'react-native'
import { chatApi } from '../api/chatApi'
import { useSocket } from '../hooks/useSocket'

const ConversationsScreen = ({ navigation, userId, role }) => {
  const [conversations, setConversations] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const socket = useSocket()

  useEffect(() => {
    loadConversations()
    loadUnreadCount()
  }, [])

  const loadConversations = async () => {
    try {
      const result = await chatApi.getConversations(userId, 1, 20, role)
      setConversations(result.data.conversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const result = await chatApi.getUnreadCount()
      setUnreadCount(result.data.unreadCount)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  // Listen for new messages to update list
  useEffect(() => {
    if (socket) {
      socket.on('new-message', (message) => {
        loadConversations()
        loadUnreadCount()
      })
    }

    return () => {
      if (socket) {
        socket.off('new-message')
      }
    }
  }, [socket])

  const renderConversation = ({ item }) => {
    const otherParticipant = role === 'user'
      ? item.participants.trainerId
      : item.participants.userId

    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', padding: 15, borderBottomWidth: 1 }}
        onPress={() => navigation.navigate('Chat', {
          conversationId: item._id,
          role,
          userId
        })}
      >
        <Image
          source={{ uri: otherParticipant.avatar }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {otherParticipant.fullName}
          </Text>
          <Text style={{ color: '#666' }} numberOfLines={1}>
            {item.lastMessage?.content || 'No messages yet'}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={{
            backgroundColor: 'red',
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: 'white', fontSize: 12 }}>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={renderConversation}
      />
    </View>
  )
}

export default ConversationsScreen
```

---

## 🔔 Push Notifications (Optional)

Để thêm push notifications khi có tin nhắn mới:

### Backend Integration
Backend cần gửi push notification khi có tin nhắn mới và người nhận đang offline.

### Firebase Cloud Messaging (FCM) Setup
```javascript
// In your app initialization
import messaging from '@react-native-firebase/messaging'

// Request permission
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    const token = await messaging().getToken()
    // Send token to backend
    await apiClient.post('/users/fcm-token', { token })
  }
}

// Listen for messages
messaging().onMessage(async remoteMessage => {
  console.log('New message:', remoteMessage)
  // Show local notification
})

// Background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage)
})
```

---

## 📝 Best Practices

### 1. Pagination
- Luôn sử dụng pagination cho danh sách conversations và messages
- Load thêm khi user scroll đến cuối

### 2. Real-time Updates
- Sử dụng WebSocket cho tin nhắn mới
- Fallback về REST API nếu WebSocket failed

### 3. Offline Support
- Cache tin nhắn trong local storage
- Queue tin nhắn khi offline, gửi khi online lại

### 4. Message Status
- Hiển thị status: sending → sent → delivered → read
- Sync status qua WebSocket

### 5. Error Handling
- Retry logic cho failed messages
- Show user-friendly error messages

### 6. Performance
- Lazy load messages (virtual scrolling)
- Debounce typing indicators
- Optimize image loading

---

## 🆘 Support & Contact

Nếu có vấn đề về API, vui lòng liên hệ:
- Email: support@gym-management.com
- Technical Documentation: [Link to full docs]
- Backend Repository: [Link to BE repo]

---

**Last Updated:** December 12, 2025
**Document Version:** 1.0
**Maintained by:** Backend Development Team
