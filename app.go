package main

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// Profile represents a student profile
type Profile struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Email          string `json:"email"`
	Username       string `json:"username"`
	EncryptedToken string `json:"encryptedToken"`
	Expiry         string `json:"expiry"`
	PIN            string `json:"pin"`
	IsActive       bool   `json:"isActive"`
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// getDataDir returns the application data directory
func getDataDir() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	dataDir := filepath.Join(homeDir, ".progitman")
	if err := os.MkdirAll(dataDir, 0700); err != nil {
		return "", err
	}
	return dataDir, nil
}

// encryptToken encrypts the token using PIN-based key
func encryptToken(token, pin string) (string, error) {
	key := sha256.Sum256([]byte(pin + "progitman-salt"))
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(token), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// encryptPIN encrypts the PIN using a master key
func encryptPIN(pin string) (string, error) {
	key := sha256.Sum256([]byte("progitman-master-key-2024"))
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(pin), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// decryptToken decrypts the token using PIN-based key
func decryptToken(encryptedToken, pin string) (string, error) {
	key := sha256.Sum256([]byte(pin + "progitman-salt"))
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	data, err := base64.StdEncoding.DecodeString(encryptedToken)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

// decryptPIN decrypts the PIN using the master key
func decryptPIN(encryptedPIN string) (string, error) {
	key := sha256.Sum256([]byte("progitman-master-key-2024"))
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	data, err := base64.StdEncoding.DecodeString(encryptedPIN)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

// SaveProfile stores a profile securely with encrypted token
func (a *App) SaveProfile(profile Profile) error {
	// Encrypt the token with PIN
	encryptedToken, err := encryptToken(profile.EncryptedToken, profile.PIN)
	if err != nil {
		return fmt.Errorf("failed to encrypt token: %v", err)
	}

	// Encrypt the PIN
	encryptedPIN, err := encryptPIN(profile.PIN)
	if err != nil {
		return fmt.Errorf("failed to encrypt PIN: %v", err)
	}

	// Create profile with encrypted token and PIN
	secureProfile := Profile{
		ID:             profile.ID,
		Name:           profile.Name,
		Email:          profile.Email,
		Username:       profile.Username,
		EncryptedToken: encryptedToken,
		Expiry:         profile.Expiry,
		PIN:            encryptedPIN, // Store encrypted PIN
	}

	// Load existing profiles
	profiles, _ := a.LoadProfiles()
	
	// Update or add profile
	found := false
	for i, p := range profiles {
		if p.ID == profile.ID {
			profiles[i] = secureProfile
			found = true
			break
		}
	}
	if !found {
		profiles = append(profiles, secureProfile)
	}

	// Save to file
	dataDir, err := getDataDir()
	if err != nil {
		return err
	}

	profilesFile := filepath.Join(dataDir, "profiles.json")
	data, err := json.MarshalIndent(profiles, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(profilesFile, data, 0600)
}

// LoadProfiles retrieves all profiles from storage
func (a *App) LoadProfiles() ([]Profile, error) {
	dataDir, err := getDataDir()
	if err != nil {
		return []Profile{}, nil
	}

	profilesFile := filepath.Join(dataDir, "profiles.json")
	data, err := os.ReadFile(profilesFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []Profile{}, nil // Return empty if file doesn't exist
		}
		return nil, err
	}

	var profiles []Profile
	if err := json.Unmarshal(data, &profiles); err != nil {
		return nil, err
	}

	return profiles, nil
}

// DeleteProfile removes a profile from storage
func (a *App) DeleteProfile(profileID string) error {
	profiles, err := a.LoadProfiles()
	if err != nil {
		return err
	}

	// Filter out the profile to delete
	var updatedProfiles []Profile
	for _, p := range profiles {
		if p.ID != profileID {
			updatedProfiles = append(updatedProfiles, p)
		}
	}

	// Save updated profiles
	dataDir, err := getDataDir()
	if err != nil {
		return err
	}

	profilesFile := filepath.Join(dataDir, "profiles.json")
	data, err := json.MarshalIndent(updatedProfiles, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(profilesFile, data, 0600)
}

// VerifyPIN checks if the provided PIN matches the stored encrypted PIN for a profile
func (a *App) VerifyPIN(profileID, pin string) error {
	// Load profiles
	profiles, err := a.LoadProfiles()
	if err != nil {
		return err
	}

	// Find profile
	var profile Profile
	for _, p := range profiles {
		if p.ID == profileID {
			profile = p
			break
		}
	}

	if profile.ID == "" {
		return fmt.Errorf("profile not found")
	}

	// Verify PIN by decrypting stored PIN
	storedPIN, err := decryptPIN(profile.PIN)
	if err != nil {
		return fmt.Errorf("failed to decrypt stored PIN: %v", err)
	}

	if storedPIN != pin {
		return fmt.Errorf("incorrect PIN")
	}

	return nil
}

// ConfigureGitAndXcode sets up Git and GitHub CLI with decrypted token
func (a *App) ConfigureGitAndXcode(profileID, pin string) error {
	// Load profiles
	profiles, err := a.LoadProfiles()
	if err != nil {
		return err
	}

	// Find profile
	var profile Profile
	for _, p := range profiles {
		if p.ID == profileID {
			profile = p
			break
		}
	}

	if profile.ID == "" {
		return fmt.Errorf("profile not found")
	}

	// Verify PIN by decrypting stored PIN
	storedPIN, err := decryptPIN(profile.PIN)
	if err != nil {
		return fmt.Errorf("failed to decrypt stored PIN: %v", err)
	}

	if storedPIN != pin {
		return fmt.Errorf("incorrect PIN")
	}

	// Decrypt token
	token, err := decryptToken(profile.EncryptedToken, pin)
	if err != nil {
		return fmt.Errorf("failed to decrypt token: %v", err)
	}

	// Configure Git
	if err := exec.Command("git", "config", "--global", "user.name", profile.Name).Run(); err != nil {
		return fmt.Errorf("failed to set git user.name: %v", err)
	}

	if err := exec.Command("git", "config", "--global", "user.email", profile.Email).Run(); err != nil {
		return fmt.Errorf("failed to set git user.email: %v", err)
	}

	// Configure Git credential store (skip GitHub CLI due to token validation issues)
	exec.Command("git", "config", "--global", "credential.helper", "store").Run()
	
	// Remove old GitHub credentials first
	cmd := exec.Command("git", "credential", "reject")
	cmd.Stdin = strings.NewReader("url=https://github.com\n\n")
	cmd.Run()
	
	// Create new credential entry for GitHub
	cmd = exec.Command("git", "credential", "approve")
	cmd.Stdin = strings.NewReader(fmt.Sprintf("url=https://github.com\nusername=%s\npassword=%s\n\n", profile.Username, token))
	cmd.Run()

	// Mark this profile as active and others as inactive
	for i := range profiles {
		profiles[i].IsActive = profiles[i].ID == profileID
	}

	// Save updated profiles
	dataDir, err := getDataDir()
	if err != nil {
		return err
	}

	profilesFile := filepath.Join(dataDir, "profiles.json")
	data, err := json.MarshalIndent(profiles, "", "  ")
	if err != nil {
		return err
	}

	os.WriteFile(profilesFile, data, 0600)
	return nil
}

// GetCurrentGitConfig returns the current Git configuration
func (a *App) GetCurrentGitConfig() (map[string]string, error) {
	config := make(map[string]string)
	
	// Get user name
	if output, err := exec.Command("git", "config", "--global", "user.name").Output(); err == nil {
		config["name"] = strings.TrimSpace(string(output))
	}
	
	// Get user email
	if output, err := exec.Command("git", "config", "--global", "user.email").Output(); err == nil {
		config["email"] = strings.TrimSpace(string(output))
	}
	
	// Check GitHub CLI status
	if exec.Command("which", "gh").Run() == nil {
		if output, err := exec.Command("gh", "auth", "status").Output(); err == nil {
			config["gh_status"] = strings.TrimSpace(string(output))
		}
	}
	
	return config, nil
}

// SetGitProfile configures Git with the provided user information (legacy)
func (a *App) SetGitProfile(name, email, username, token string) error {
	if err := exec.Command("git", "config", "--global", "user.name", name).Run(); err != nil {
		return fmt.Errorf("failed to set git user.name: %v", err)
	}

	if err := exec.Command("git", "config", "--global", "user.email", email).Run(); err != nil {
		return fmt.Errorf("failed to set git user.email: %v", err)
	}

	if err := exec.Command("git", "config", "--global", "credential.helper", "osxkeychain").Run(); err != nil {
		return fmt.Errorf("failed to set credential helper: %v", err)
	}

	return nil
}
