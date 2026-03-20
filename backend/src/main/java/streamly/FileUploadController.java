package streamly;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/admin/upload")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    private static final String UPLOAD_DIR = "../data/uploads";

    public FileUploadController() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath();
            Files.createDirectories(uploadPath);
            logger.info("Upload directory created at: " + uploadPath);
        } catch (IOException e) {
            logger.error("Could not create upload directory", e);
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("Received upload request, file size: " + (file != null ? file.getSize() : "null"));
        
        if (file == null || file.isEmpty()) {
            logger.warn("File is empty");
            return ResponseEntity.badRequest().body("File is empty");
        }

        String contentType = file.getContentType();
        logger.info("Content type: " + contentType);
        if (contentType == null || !contentType.startsWith("image/")) {
            logger.warn("Invalid content type: " + contentType);
            return ResponseEntity.badRequest().body("Only image files are allowed");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(UPLOAD_DIR).toAbsolutePath().resolve(filename);

        try {
            Files.write(filePath, file.getBytes());
            String url = "/uploads/" + filename;
            logger.info("File uploaded successfully: " + url);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            logger.error("Failed to write file", e);
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }
}
