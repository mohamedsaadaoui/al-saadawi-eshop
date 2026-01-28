# Test de Diagnostic - Upload d'Image

## Problème
Les images ne sont pas uploadées dans le dossier `uploads/` ni sauvegardées dans la base de données.

## Vérifications à Faire

### 1. Console du Navigateur (F12)
Quand vous cliquez "Create Product", vous devriez voir :
```
=== FORM SUBMIT DEBUG ===
Form values: {...}
File list: [...]
Appending image: File {...}
```

**Si vous voyez "NO IMAGE TO UPLOAD"** → Le fichier n'est pas sélectionné correctement dans le formulaire

### 2. Terminal Backend
Vous devriez voir :
```
=== CREATE PRODUCT DEBUG ===
Name: ...
Image received: image.jpg
Image size: 12345
```

**Si vous voyez "Image received: NULL"** → Le fichier n'arrive pas au backend

### 3. Vérifier le Dossier
```bash
ls backend/uploads/
```

Devrait contenir vos images uploadées.

## Solutions Possibles

### Si le fichier n'est pas sélectionné :
- Vérifiez que vous cliquez bien sur la zone d'upload
- Vérifiez que l'aperçu de l'image s'affiche
- Essayez avec une petite image (< 1MB)

### Si le fichier n'arrive pas au backend :
- Problème de configuration CORS
- Problème de Content-Type
- Problème d'authentification

### Si le fichier arrive mais n'est pas sauvegardé :
- Problème de permissions sur le dossier uploads/
- Erreur dans StorageService

## Logs à Partager
1. Console navigateur (F12)
2. Terminal backend
3. Erreurs éventuelles
