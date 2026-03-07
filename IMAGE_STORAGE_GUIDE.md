# Profile Image Storage Guide

## How It Works

Profile images are now stored as **base64-encoded data URLs** in MongoDB. This approach:
- ✅ Eliminates the need for separate file storage services
- ✅ Simplifies deployment (no file system management)
- ✅ Works seamlessly with MongoDB
- ✅ Enables real-time image sync across devices

## Technical Implementation

### Frontend (React Native)

1. **Image Selection**
   ```javascript
   // Images are picked with base64 encoding enabled
   ImagePicker.launchImageLibraryAsync({
     quality: 0.3,  // Reduced to keep size manageable
     base64: true,  // Enables base64 encoding
   });
   ```

2. **Base64 Format**
   ```javascript
   // Image is converted to data URL format
   const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`;
   ```

3. **Storage**
   - Images are stored directly in the profile state as base64
   - Sent to backend as part of the profile update
   - React Native's Image component displays base64 data URLs natively

### Backend (Node.js/Express)

1. **Increased Payload Limit**
   ```javascript
   app.use(express.json({ limit: '10mb' }));
   ```
   - Default Express limit is ~100KB
   - Base64 images require more (usually 500KB-2MB)

2. **Validation**
   ```javascript
   if (profileImage && !profileImage.startsWith('data:image/')) {
     // Reject invalid format
   }
   ```

3. **Database Storage**
   - Stored as String type in MongoDB
   - MongoDB can handle large strings efficiently
   - No special configuration needed

## Image Size Optimization

### Quality Settings
```javascript
quality: 0.3  // 30% quality - typical size: 200-500KB
quality: 0.5  // 50% quality - typical size: 500KB-1MB
quality: 0.8  // 80% quality - typical size: 1-2MB
```

### Recommended Settings
- **Profile pictures**: `quality: 0.3-0.5` (sufficient for 1:1 aspect ratio)
- **Aspect ratio**: `[1, 1]` (square images are smaller)
- **Editing**: `allowsEditing: true` (helps users crop to optimal size)

## Testing the Feature

### 1. Test Image Upload

```javascript
// Frontend flow:
1. Click profile image placeholder
2. Select an image from gallery
3. Image is immediately displayed (base64)
4. Click Save button
5. Check console: "✅ Image selected: { base64Size: 123456 }"
6. Check backend console: "✅ Profile image saved to database: { imageSize: 123456 }"
```

### 2. Test Real-Time Sync

```javascript
// Multi-device test:
1. Open app on Device A and Device B with same account
2. Update profile image on Device A
3. Device B should receive socket event
4. Device B's profile image updates automatically
```

### 3. Test Persistence

```javascript
// Database persistence:
1. Upload profile image
2. Close app completely
3. Reopen app
4. Profile image should load from AsyncStorage (offline)
5. Once connected, sync with database (online)
```

## Console Logs to Watch

### Frontend
```
✅ Image selected: { 
  uri: "file://...", 
  base64Size: 234567,
  width: 1024, 
  height: 1024 
}

💾 Saving profile... { 
  name: "John Doe", 
  hasImage: true, 
  imageSize: 234567 
}
```

### Backend
```
✅ Profile image received (base64), size: 234567 bytes

✅ User profile saved to database: {
  userId: "abc123",
  hasImage: true,
  imageSize: 234567
}
```

## Troubleshooting

### Image Not Saving

**Problem**: Image shows locally but doesn't save to backend

**Solutions**:
1. Check backend console for payload size errors
2. Verify base64 format: `data:image/jpeg;base64,...`
3. Ensure Express limit is set: `express.json({ limit: '10mb' })`
4. Check network request in dev tools (size of POST request)

### Image Too Large Error

**Problem**: "PayloadTooLargeError: request entity too large"

**Solutions**:
1. Reduce image quality: `quality: 0.2-0.3`
2. Increase backend limit: `limit: '20mb'`
3. Check original image size before uploading

### Image Not Displaying

**Problem**: Image saves but doesn't display

**Solutions**:
1. Verify base64 format in database (should start with `data:image/`)
2. Check React Native Image component can render data URLs
3. Look for console errors in app
4. Verify the complete base64 string was saved (not truncated)

### Performance Issues

**Problem**: App is slow when loading profiles with images

**Solutions**:
1. Reduce image quality further
2. Implement lazy loading for images
3. Cache images in AsyncStorage
4. Consider CDN for production (AWS S3, Cloudinary)

## Production Considerations

### For Small-Scale Apps
- ✅ Base64 storage is fine
- ✅ MongoDB can handle it efficiently
- ✅ Simple to deploy

### For Large-Scale Apps
- ⚠️ Consider cloud storage (AWS S3, Cloudinary)
- ⚠️ Use CDN for faster delivery
- ⚠️ Store only image URLs in database
- ⚠️ Implement image optimization pipeline

## Alternative: Cloud Storage (Future Enhancement)

If you want to move to cloud storage later:

1. **Install Cloudinary SDK**
   ```bash
   npm install cloudinary react-native-cloudinary
   ```

2. **Upload Flow**
   ```javascript
   // Upload to Cloudinary
   const response = await cloudinary.upload(base64Image);
   const imageUrl = response.secure_url;
   
   // Store URL in database (not base64)
   profileData.profileImage = imageUrl;
   ```

3. **Benefits**
   - Faster image loading (CDN)
   - Automatic optimization
   - Smaller database size
   - Better for scaling

## Security Notes

1. **File Type Validation**
   - Backend validates `data:image/` prefix
   - Rejects non-image formats

2. **Size Limits**
   - Express enforces 10MB limit
   - Prevents DOS attacks

3. **Content Validation**
   - Consider adding virus scanning for production
   - Validate image dimensions

## Current Status

✅ **Working Features**:
- Image selection from gallery
- Base64 encoding
- Database storage
- Real-time sync via Socket.IO
- Offline support with AsyncStorage
- Multi-device synchronization

🎯 **Verified**:
- Images persist in MongoDB
- Images sync across devices in real-time
- Images load after app restart
- Express handles payload size correctly

---

Last Updated: February 27, 2026
