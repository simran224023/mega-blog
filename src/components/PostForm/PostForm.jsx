import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";
import { useToast } from "../../hooks/useToast";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import styles from "./PostForm.module.css";
import RealTimeEditor from "../RealTimeEditor/RealTimeEditor";

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    post?.featuredImage ? appwriteService.getFileView(post.featuredImage) : null
  );

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "")
        .replace(/\s/g, "-");
    return "";
  }, []);

  // Fix: Watch only the title field specifically
  useEffect(() => {
    const titleValue = watch("title");
    
    // Only update slug when title changes
    if (titleValue) {
      setValue("slug", slugTransform(titleValue), { shouldValidate: true });
    }
  }, [watch("title"), slugTransform, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const submit = async (data) => {
    if (!userData) {
      error("You must be logged in to create a post");
      return;
    }

    setLoading(true);
    try {
      let fileId = null;

      if (imageFile) {
        const uploadedFile = await appwriteService.uploadImage(imageFile);
        if (uploadedFile) {
          fileId = uploadedFile.$id;
          if (post?.featuredImage) {
            await appwriteService.deleteFile(post.featuredImage);
          }
        } else {
          error("Failed to upload image");
          setLoading(false);
          return;
        }
      }

      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: fileId || post?.featuredImage || null, // Allow null for no image
        userId: userData.$id,
      };

      let dbPost;
      if (post) {
        dbPost = await appwriteService.updatePost({
          postId: post.$id,
          ...postData,
        });
        if (dbPost) {
          success("Post updated successfully!");
          navigate(`/post/${dbPost.$id}`);
        } else {
          error("Failed to update post");
        }
      } else {
        dbPost = await appwriteService.createPost(postData);
        if (dbPost) {
          success("Post created successfully!");
          navigate(`/post/${dbPost.$id}`);
        } else {
          error("Failed to create post");
        }
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      error(post ? "Failed to update post" : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.editorContainer}>
        {/* Compact Header */}
        <div className={styles.editorHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {post ? "Edit Post" : "Create Post"}
            </h1>
            <p className={styles.pageSubtitle}>
              {post
                ? "Update your existing post"
                : "Share your thoughts with the world"}
            </p>
          </div>
          <div className={styles.headerRight}>
            <Button
              type="submit"
              form="postForm" 
              variant="primary"
              size="large"
              className={loading ? styles.loadingButton : ""}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.circleLoader}></span>
              ) : (
                <>{post ? "Update" : "Create"}</>
              )}
            </Button>
          </div>
        </div>

        <form
          id="postForm"
          onSubmit={handleSubmit(submit)}
          className={styles.postForm}
        >
          {/* Editor Interface */}
          <div className={styles.editorInterface}>
            <div className={styles.editorMain}>
              {/* Title Input */}
              <div className={styles.titleSection}>
                <input
                  type="text"
                  placeholder="Post title"
                  className={`${styles.titleInput} ${
                    errors.title ? styles.error : ""
                  }`}
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                  })}
                />
                {errors.title && (
                  <span className={styles.errorMessage}>
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Content Editor */}
              <div className={styles.editorSection}>
                <RealTimeEditor
                  name="content"
                  control={control}
                  defaultValue={getValues("content")}
                  error={errors.content?.message}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className={styles.editorSidebar}>
              <div className={styles.sidebarContent}>
                {/* Publish Settings */}
                <div className={styles.sidebarCard}>
                  <h3 className={styles.cardTitle}>Publish</h3>
                  <div className={styles.cardContent}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Status</label>
                      <select
                        className={styles.fieldSelect}
                        {...register("status")}
                      >
                        <option value="active">Published</option>
                        <option value="inactive">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* URL Settings */}
                <div className={styles.sidebarCard}>
                  <h3 className={styles.cardTitle}>URL</h3>
                  <div className={styles.cardContent}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Slug</label>
                      <input
                        type="text"
                        placeholder="url-slug"
                        className={`${styles.fieldInput} ${
                          errors.slug ? styles.error : ""
                        }`}
                        {...register("slug", {
                          required: "URL slug is required",
                          pattern: {
                            value: /^[a-z0-9-]+$/,
                            message:
                              "Slug can only contain lowercase letters, numbers, and hyphens",
                          },
                        })}
                        // Remove the onInput handler to avoid double updates
                      />
                      <div className={styles.urlPreview}>
                        <span>
                          yoursite.com/post/
                          <strong>{watch("slug") || "url-slug"}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className={styles.sidebarCard}>
                  <h3 className={styles.cardTitle}>
                    Featured Image (Optional)
                  </h3>
                  <div className={styles.cardContent}>
                    <div className={styles.imageUpload}>
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        className={styles.hiddenInput}
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="imageUpload"
                        className={styles.imageUploadLabel}
                      >
                        {imagePreview ? (
                          <div className={styles.imagePreview}>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className={styles.previewImage}
                            />
                            <div className={styles.imageOverlay}>
                              <span>📷 Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.uploadPlaceholder}>
                            <span className={styles.uploadIcon}>📷</span>
                            <span>Add Image (Optional)</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}