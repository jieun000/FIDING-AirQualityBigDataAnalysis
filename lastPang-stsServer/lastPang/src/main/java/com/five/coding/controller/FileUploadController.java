package com.five.coding.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  
public class FileUploadController {

    // 디렉터리 및 해당 내용을 삭제하는 도우미 메서드
    private static boolean deleteDirectory(File directory) {
        if (directory.exists()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteDirectory(file);
                    } else {
                        file.delete();
                    }
                }
            }
        }
        return directory.delete();
    }

    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {
        System.out.println("file Controller 진입" + file + ", id:" + id);
        if (file.isEmpty()) {
            return "File is empty";
        }

        // You can access file information like name and content type
        String fileName = file.getOriginalFilename();
        // String contentType = file.getContentType();

        try {
            // Specify the base directory where you want to save the file
            String baseDirectory = "C:\\jieun\\project3\\backend\\templates\\knn_examples\\train";

            // Specify the relative directory based on some logic (e.g., user-specific directory)
            String relativeDirectory = id + File.separator;

            // Combine the base directory and relative directory to create the complete directory path
            String completeDirectoryPath = baseDirectory + File.separator + relativeDirectory;

            // 디렉토리가 존재하면 삭제하고 다시 생성
            File directory = new File(completeDirectoryPath);
            if (directory.exists()) {
                // 디렉토리 및 해당 내용을 삭제
                if (deleteDirectory(directory)) {
                    System.out.println("기존 디렉토리 삭제 및 새로 생성: " + completeDirectoryPath);
                } else {
                    System.out.println("기존 디렉토리 삭제 실패: " + completeDirectoryPath);
                    // 실패할 경우 예외 처리 또는 적절한 조치 수행
                }
            }

            // 디렉토리 생성
            if (directory.mkdirs()) {
                System.out.println("새로운 디렉토리 생성: " + completeDirectoryPath);
            } else {
                System.out.println("디렉토리 생성 실패: " + completeDirectoryPath);
                // 실패할 경우 예외 처리 또는 적절한 조치 수행
            }

            // Combine the directory and file name to create the complete file path
            String filePath = completeDirectoryPath + fileName;

            // Save the file
            file.transferTo(new File(filePath));

            // Process the file as needed (e.g., save file information to a database)

            // Return success message or redirect to another page
            return "upload-success";
        } catch (IOException e) {
            // Handle file processing exception
            e.printStackTrace();
            return "upload-failure";
        }
    }
}