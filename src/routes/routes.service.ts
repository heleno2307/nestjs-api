import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DirectionsService } from '../maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService:DirectionsService){}

  async create(createRouteDto: CreateRouteDto) {
    const {
      available_travel_modes,
      geocoded_waypoints,
      routes,
      request
    } = await this.directionsService.getDirections(
      createRouteDto.source_id,
      createRouteDto.destination_id
    );

    const legs = routes[0].legs[0]

    return this.prismaService.route.create({
      data:{
        name: createRouteDto.name,
        source: {
          name: legs.start_address,
          location: {
            lat: legs.start_location.lat,
            lng: legs.start_location.lng
          }
        },
        destination: {
          name: legs.end_address,
          location: {
            lat: legs.end_location.lat,
            lng: legs.end_location.lng
          }
        },
        distance: legs.distance.value,
        duration: legs.duration.value,
        directions: JSON.parse(
          JSON.stringify({
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request,
          })
        )

      }
    })
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: string) {
    return this.prismaService.route.findUniqueOrThrow({
      where: { id }
    });
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const {
      available_travel_modes,
      geocoded_waypoints,
      routes,
      request
    } = await this.directionsService.getDirections(
      updateRouteDto.source_id,
      updateRouteDto.destination_id
    );

    const legs = routes[0].legs[0]

    return this.prismaService.route.update({
      where: { id },
      data:{
        name: updateRouteDto.name,
        source: {
          name: legs.start_address,
          location: {
            lat: legs.start_location.lat,
            lng: legs.start_location.lng
          }
        },
        destination: {
          name: legs.end_address,
          location: {
            lat: legs.end_location.lat,
            lng: legs.end_location.lng
          }
        },
        distance: legs.distance.value,
        duration: legs.duration.value,
        directions: JSON.parse(
          JSON.stringify({
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request,
          })
        )

      }
    })
  }

  remove(id: string) {
    this.prismaService.route.delete({
      where: { id }
    })
    
    return `This action removes a #${id} route`;
  }
}
