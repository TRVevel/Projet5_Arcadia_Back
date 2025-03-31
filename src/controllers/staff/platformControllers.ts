import { Request, Response } from "express";
import Platform from "../../models/platform.model";
export async function getAllPlatform(req: Request, res: Response) {
    try {
        const platforms = await Platform.findAll();
        res.status(200).json(platforms);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des platforms : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des platforms' })
        
    }
}

export async function addPlatform(req: Request, res: Response) {
    const {name, devices} = await req.body;
    try{
        if (!name || !devices || devices.length === 0) {
            res.status(400).json({ message: 'Tous les champs sont requis' });
            return;
        }
        const newGame = await Platform.create({
            name,
            devices
        });
        res.status(201).json({message:'Ajout de la platform:', data: newGame});

    }catch(error:any){
        if(error.code===11000){
            res.status(400).json({message: 'Cette platform est déjà inscrite!'});
            return 
        }
        console.error("Erreur lors de l'ajout de la platform : ", error);
        res.status(500).json({ message: "Erreur lors de la l'ajout de la platform "});
    }
}

export async function modifyPlatform(req: Request, res: Response) {
    const {name} = await req.body;
    const {id} = await req.params;
    try{
        if ( !name) {
            res.status(400).json({ message: 'Vous devez taper un nom de platform' });
            return;
        }
        const platform = await Platform.findByPk(id);
        if(!platform){
            res.status(404).json({message: 'Platform non trouvée'});
            return;
        }
        await platform.update({
            name
        });
        res.status(200).json({message: 'Platform modifiée avec succès', data: platform});
    }catch(error:any){
        console.error("Erreur lors de la modification de la platform : ", error);
        res.status(500).json({ message: "Erreur lors de la modification de la platform "});
    }
}
export async function addDeviceFromPlatform(req: Request, res: Response){
    const {devices} = await req.body;
    const {id} = await req.params;
    try{
        if(!devices){
            res.status(400).json({message: 'Le device à ajouter est requis'});
            return;
        }
        const platform = await Platform.findByPk(id);
        if(!platform){
            res.status(404).json({message: 'Platform non trouvée'});
            return;
        } 
        // Créer une nouvelle copie du tableau avec l'ajout du nouvel élément
        const updatedDevices = [...platform.devices, devices];

        // Mettre à jour directement la base de données
        await platform.update({ devices: updatedDevices });
        res.status(200).json({message: 'Device ajouté avec succès', data: platform});
    }catch(error:any){
        console.error("Erreur lors de l'ajout du device à la platform : ", error);
        res.status(500).json({ message: "Erreur lors de l'ajout du device à la platform "});
    }
}

export async function removeDeviceFromPlatform(req: Request, res: Response) {
    const { device } = req.body;
    const { id } = req.params;

    try {
        if (!device) {
            res.status(400).json({ message: "Le device à retirer est requis" });
            return ;
        }

        const platform = await Platform.findByPk(id);
        if (!platform) {
            res.status(404).json({ message: "Platform non trouvée" });
            return ;
        }

        // Filtrer la liste des devices pour retirer celui spécifié
        platform.devices = platform.devices.filter((d: string) => d !== device);

        await platform.save(); // Sauvegarder les changements

        res.status(200).json({ message: "Device retiré avec succès", data: platform });
    } catch (error: any) {
        console.error("Erreur lors de la suppression du device de la platform : ", error);
        res.status(500).json({ message: "Erreur lors de la suppression du device de la platform" });
    }
}
